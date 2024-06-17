import fetch from "node-fetch";
import { xnxxSearch, xnxxDownloader } from "../../lib/scraper/scraped-downloader.js";
const handler = async (m, { conn: conn, usedPrefix: usedPrefix, text: text, args: args, command: command }) => {
  try {
    if ("xnxx" === command) {
      if (!text) throw `Contoh penggunaan ${usedPrefix}${command} japan`;
      const teks = (await xnxxSearch(text)).result.map(((item, index) => `🔍 *[ HASIL ${index + 1} ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.link}\n📝 Ringkasan: ${item.info}`)).filter((v => v)).join("\n\n________________________\n\n");
      m.reply(teks);
    }
    if ("xnxxdl" === command) {
      if (!text) throw `Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`;
      const item = await xnxxDownloader(text),
        teksdl = `🔍 *[ HASIL ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.URL}\n📝 Ringkasan: ${item.info}`;
      await conn.sendMessage(m.chat, {
        video: {
          url: item.files.HLS || item.files.high || item.files.low
        },
        caption: teksdl + " 📥"
      }, {
        quoted: m
      });
    }
    if ("dlxnxx" === command) {
      if (!args[0]) throw `Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-uy5a73b/mom_is_horny_-_brooklyn`;
      try {
        const json = await fetch(API("lolhuman", "/api/xnxx", {
            url: text
          }, "apikey")),
          x = await json.json(),
          caption = `🎥 *Judul:* ${x.result.title}\n⌛ *Durasi:* ${x.result.duration}\n👀 *Dilihat:* ${x.result.view}\n⭐ *Rating:* ${x.result.rating}\n👍 *Suka:* ${x.result.like}\n👎 *Tidak Suka:* ${x.result.dislike}\n💬 *Komentar:* ${x.result.comment}\n🏷️ *Tag:* ${Array.from(x.result.tag)}\n📝 *Deskripsi:* ${x.result.description}`;
        await conn.sendFile(m.chat, x.result.link[1].link, "asupan.mp4", caption + " 📤", m);
      } catch (e) {
        throw `Terjadi kesalahan saat mengunduh: ${e.message} ❌`;
      }
    }
  } catch (error) {
    throw `Terjadi kesalahan: ${error.message} ❌`;
  }
};
handler.help = ["xnxx", "dlxnxx", "xnxxdl"].map((v => v + " <query>")), handler.command = ["xnxx", "dlxnxx", "xnxxdl"],
  handler.tags = ["nsfw"];
export default handler;