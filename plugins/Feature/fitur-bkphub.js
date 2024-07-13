import fetch from "node-fetch";
import {
  xnxxSearch,
  xnxxDownloader
} from "../../lib/scraper/scraped-downloader.js";
const handler = async (m, {
  conn,
  usedPrefix,
  text,
  args,
  command
}) => {
  try {
    if ("xnxx" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} japan`);
        return;
      }
      const teks = (await xnxxSearch(text)).result.map((item, index) => `🔍 *[ HASIL ${index + 1} ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.link}\n📝 Ringkasan: ${item.info}`).filter(v => v).join("\n\n________________________\n\n");
      m.reply(teks);
    }
    if ("xnxxdl" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`);
        return;
      }
      const item = await xnxxDownloader(text);
      const teksdl = `🔍 *[ HASIL ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.URL}\n📝 Ringkasan: ${item.info}`;
      const buffer = (await conn.getFile(item.files.low)).data || (await conn.getFile(item.files.HLS)).data || (await conn.getFile(item.files.high)).data;
      await conn.sendMessage(m.chat, {
        video: buffer,
        caption: teksdl + " 📥"
      }, {
        quoted: m
      });
    }
    if ("dlxnxx" === command) {
      if (!args[0]) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-uy5a73b/mom_is_horny_-_brooklyn`);
        return;
      }
      try {
        const json = await fetch(API("lolhuman", "/api/xnxx", {
          url: text
        }, "apikey"));
        const x = await json.json();
        const caption = `🎥 *Judul:* ${x.result.title}\n⌛ *Durasi:* ${x.result.duration}\n👀 *Dilihat:* ${x.result.view}\n⭐ *Rating:* ${x.result.rating}\n👍 *Suka:* ${x.result.like}\n👎 *Tidak Suka:* ${x.result.dislike}\n💬 *Komentar:* ${x.result.comment}\n🏷️ *Tag:* ${Array.from(x.result.tag)}\n📝 *Deskripsi:* ${x.result.description}`;
        await conn.sendFile(m.chat, x.result.link[1].link, "asupan.mp4", caption + " 📤", m);
      } catch (e) {
        m.reply(`Terjadi kesalahan saat mengunduh: ${e.message} ❌`);
      }
    }
  } catch (error) {
    m.reply(`Terjadi kesalahan: ${error.message} ❌`);
  }
};
handler.help = ["xnxx", "dlxnxx", "xnxxdl"].map(v => v + " <query>");
handler.command = ["xnxx", "dlxnxx", "xnxxdl"];
handler.tags = ["nsfw"];
export default handler;
