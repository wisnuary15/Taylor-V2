import fetch from "node-fetch";
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
const githubDownload = async url => {
  try {
    const response = await fetch(url, {
      method: "HEAD"
    });
    const filename = response.headers.get("content-disposition").match(/attachment; filename=(.*)/)[1];
    return {
      filename: filename,
      url: url
    };
  } catch (error) {
    throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
  }
};
const getRepoInfo = async (user, repo) => {
  try {
    const response = await fetch(`https://api.github.com/repos/${user}/${repo}`);
    if (!response.ok) {
      throw new Error("Failed to fetch repository info");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch repository info: ${error.message}`);
  }
};
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  try {
    if (!args[0]) {
      return m.reply(`Contoh penggunaan: ${usedPrefix}${command} <url>`);
    }
    if (!regex.test(args[0])) {
      return m.reply("Link salah!");
    }
    let [_, user, repo] = args[0].match(regex) || [];
    repo = repo.replace(/\.git$/, "");
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
    m.react(wait);
    const {
      filename,
      downloadUrl
    } = await githubDownload(url);
    const repoInfo = await getRepoInfo(user, repo);
    const caption = `
📦 *GitHub Repository Downloaded* 📦
────────────────────
*Name:* ${repoInfo.name}
*Owner:* ${repoInfo.owner.login}
*Description:* ${repoInfo.description || "No description available"}
*Stars:* ${repoInfo.stargazers_count}
*Forks:* ${repoInfo.forks_count}
*Open Issues:* ${repoInfo.open_issues_count}
*URL:* ${repoInfo.html_url}
────────────────────
    `.trim();
    await conn.sendFile(m.chat, downloadUrl, filename, caption, m);
  } catch (error) {
    m.react(eror);
  }
};
handler.help = ["gitclone"].map(v => v + " <url>");
handler.tags = ["downloader"];
handler.command = /^gitclone$/i;
handler.limit = true;
export default handler;
