import fetch from "node-fetch";
const handler = async (m, {
  text
}) => {
  try {
    if (!text) throw "Cari apa?";
    let res = await fetch(API("https://api.github.com", "/search/repositories", {
        q: text
      })),
      json = await res.json();
    if (200 !== res.status) throw json;
    let str = json.items.map((repo, index) => `\n${1 + index}. *${repo.full_name}*${repo.fork ? " (fork)" : ""}\n_${repo.html_url}_\n_Dibuat pada *${formatDate(repo.created_at)}*_\n_Terakhir update pada *${formatDate(repo.updated_at)}*_\n👁  ${repo.watchers}   🍴  ${repo.forks}   ⭐  ${repo.stargazers_count}\n${repo.open_issues} Issue${repo.description ? `\n*Deskripsi:*\n${repo.description}` : ""}\n*Clone:* \`\`\`$ git clone ${repo.clone_url}\`\`\`\n`.trim()).join("\n\n");
    m.reply(str);
  } catch (error) {
    console.error("Error:", error), m.reply("Terjadi kesalahan saat mencari repository GitHub.");
  }
};
handler.help = ["githubs"], handler.tags = ["tools"], handler.command = /^(ghs|githubs)$/i;
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