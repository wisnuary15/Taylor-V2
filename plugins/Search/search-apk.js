import gplay from "google-play-scraper";
const handler = async (m, {
  conn,
  text,
  command,
  usedPrefix
}) => {
  if (!text) {
    throw "Masukkan query";
  }
  m.react(wait);
  try {
    let res = await gplay.search({
      term: text
    });
    if (!res.length) {
      throw `Query "${text}" tidak ditemukan :/`;
    }
    let teks = Object.values(res).map((v, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n` + `📰 *title:* ${v.title || "Tidak diketahui"}\n` + `👩‍💻 *developer:* ${v.developer || "Tidak diketahui"}\n` + `⭐️ *score:* ${v.score || "Tidak diketahui"}\n` + `💬 *scoreText:* ${v.scoreText || "Tidak diketahui"}\n` + `💲 *price:* ${v.price || "Tidak diketahui"}\n` + `🆔 *appId:* ${v.appId || "Tidak diketahui"}\n` + `📝 *summary:* ${cleanHtml(v.summary) || "Tidak diketahui"}\n` + `🔗 *url:* ${v.url || "Tidak diketahui"}\n` + `🖼️ *icon:* ${v.icon || "Tidak diketahui"}\n` + `💰 *free:* ${v.free || "Tidak diketahui"}`).filter(v => v).join("\n\n________________________\n\n");
    m.reply(teks);
  } catch (e) {
    console.error("Error:", e);
    m.react(eror);
  }
};
handler.help = ["apksearch"];
handler.tags = ["tools"];
handler.command = /^(ap([kp]search|(ps|k))|searchapk)$/i;
export default handler;

function cleanHtml(html) {
  return html.replace(/<[^>]+>/g, "");
}