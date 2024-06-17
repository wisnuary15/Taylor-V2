import fetch from "node-fetch";
const handler = async (m, { text: text, command: command, usedPrefix: usedPrefix }) => {
  try {
    if (!text) throw `Contoh:\n${usedPrefix + command} stikerinbot`;
    let res = await fetch(API("https://api.github.com", "/search/repositories", {
      q: text
    }));
    if (!res.ok) throw "Error fetching data from GitHub";
    let str = (await res.json()).items.map(((repo, index) => `\n>      「 ${1 + index} 」       <\nɴᴀᴍᴇ ʀᴇᴘᴏ : ${repo.name}\nʙʏ : ${repo.owner.login}\nғᴏʀᴋᴇᴅ : ${repo.fork ? "True" : "False"}\nᴘʀɪᴠᴀᴛᴇ : ${repo.private ? "True" : "False"}\n\n➔ ᴄʀᴇᴀᴛᴇᴅ ᴏɴ : ${formatDate(repo.created_at)}\n➔ ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇ ᴏɴ :${formatDate(repo.updated_at)}\n👁  ${repo.watchers}   🍴  ${repo.forks}   ⭐  ${repo.stargazers_count}\n❗ ɪssᴜᴇ : ${repo.open_issues} ${repo.description ? `\n📚 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:\n${repo.description}` : ""}\n\n⑂ ᴄʟᴏɴᴇ :\n$ git clone ${repo.clone_url}\n`.trim())).join("\n— — — — — — — — — — — — — —\n");
    await conn.reply(m.chat, `*${htki} ɢɪᴛʜᴜʙ sᴇᴀʀᴄʜ ${htka}*\n` + str, m);
  } catch (error) {
    console.error("Error:", error), m.reply("Terjadi kesalahan saat mencari repository GitHub.");
  }
};
handler.help = ["githubsearch"].map((v => v + " <pencarian>")), handler.tags = ["internet", "downloader"],
  handler.command = /^g(ithub|h)s(earch)$/i;
export default handler;

function formatDate(n, locale = "id") {
  return new Date(n).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
}