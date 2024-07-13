import gplay from "google-play-scraper";
const handler = async (m, {
  conn,
  text,
  command,
  usedPrefix
}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom()), conn.getName(who);
  if (!text) throw "Input Query";
  m.react(wait);
  try {
    let res = await gplay.search({
      term: text
    });
    if (!res.length) throw `Query "${text}" not found :/`;
    let teks = Object.values(res).map((v, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n📰 *title:* ${v.title || "Tidak diketahui"}\n👩‍💻 *developer:* ${v.developer || "Tidak diketahui"}\n⭐️ *score:* ${v.score || "Tidak diketahui"}\n💬 *scoreText:* ${v.scoreText || "Tidak diketahui"}\n💲 *price:* ${v.price || "Tidak diketahui"}\n🆔 *appId:* ${v.appId || "Tidak diketahui"}\n📝 *summary:* ${cleanHtml(v.summary) || "Tidak diketahui"}\n🔗 *url:* ${v.url || "Tidak diketahui"}\n🖼️ *icon:* ${v.icon || "Tidak diketahui"}\n💰 *free:* ${v.free || "Tidak diketahui"}`).filter(v => v).join("\n\n________________________\n\n");
    m.reply(teks);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["apksearch"], handler.tags = ["tools"], handler.command = /^(ap([kp]search|(ps|k))|searchapk)$/i;
export default handler;

function cleanHtml(html) {
  return html.replace(/<[^>]+>/g, "");
}
