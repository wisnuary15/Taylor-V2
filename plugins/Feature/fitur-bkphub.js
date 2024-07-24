import fetch from "node-fetch";
import {
  xnxxSearch,
  xnxxDownloader
} from "../../lib/scraper/scraped-downloader.js";
import {
  eporner
} from "../../lib/download/eporner.js";
import {
  dekuai
} from "../../lib/ai/ai-dekuai.js";
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
      const teks = ((await xnxxSearch(text))?.result || (await dekuai.api("api/xsearch", {
        q: text
      }))?.result?.result).map((item, index) => `🔍 *[ HASIL ${index + 1} ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.link}\n📝 Ringkasan: ${item.info}`).filter(v => v).join("\n\n________________________\n\n");
      m.reply(teks);
    }
    if ("xnxxdl" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`);
        return;
      }
      const item = await xnxxDownloader(text) || (await dekuai.api("api/xdl", {
        q: text
      }))?.result;
      const teksdl = `🔍 *[ HASIL ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.URL}\n📝 Ringkasan: ${item.info}`;
      const buffer = (await conn.getFile(item.files?.low)).data || (await conn.getFile(item.files?.HLS)).data || (await conn.getFile(item.files?.high)).data;
      await conn.sendMessage(m.chat, {
        video: buffer,
        caption: teksdl + " 📥"
      }, {
        quoted: m
      });
    }
    if ("xvideos" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} japan`);
        return;
      }
      const teks = (await dekuai.api("prn/search", {
        "/": text
      })).result.map((item, index) => `🔍 *[ HASIL ${index + 1} ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.video}\n📝 uploader: ${item.uploaderName}\nduration: ${item.duration}`).filter(v => v).join("\n\n________________________\n\n");
      m.reply(teks);
    }
    if ("xvideosdl" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} https://www.xvideos.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`);
        return;
      }
      const {
        result: item
      } = await dekuai.api("prn/download", {
        url: text
      });
      const teksdl = `🔍 *[ HASIL ]*\n📚 Judul: ${item.name}\n🔗 Link: ${item.contentUrl?.Default_Quality}\n📝 description: ${item.description}`;
      const buffer = (await conn.getFile(item.contentUrl?.Default_Quality)).data || (await conn.getFile(item.contentUrl?.Low_Quality)).data || (await conn.getFile(item.contentUrl?.HD_Quality)).data;
      await conn.sendMessage(m.chat, {
        video: buffer,
        caption: teksdl + " 📥"
      }, {
        quoted: m
      });
    }
    if ("eporner" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} japan`);
        return;
      }
      const teks = (await eporner.search(text)).map((item, index) => `🔍 *[ HASIL ${index + 1} ]*\n📚 Judul: ${item.title}\n🔗 Link: ${item.link}\nquality: ${item.quality}\nduration: ${item.duration}\nuploader: ${item.uploader}`).filter(v => v).join("\n\n________________________\n\n");
      m.reply(teks);
    }
    if ("epornerdl" === command) {
      if (!text) {
        m.reply(`Contoh penggunaan ${usedPrefix}${command} https://www.eporner.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`);
        return;
      }
      const {
        download: item
      } = await eporner.download(text);
      const teksdl = `🔍 *[ HASIL ]*\n📚 info: ${item[0]?.info}\n🔗 Link: ${item[0]?.URL}\nquality: ${item[0]?.quality}\nsize: ${item[0]?.size}`;
      const buffer = (await conn.getFile(item[0]?.url)).data;
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
handler.help = ["xnxx", "xnxxdl", "xvideos", "xvideosdl", "eporner", "epornerdl", "dlxnxx"].map(v => v + " <query>");
handler.command = ["xnxx", "xnxxdl", "xvideos", "xvideosdl", "eporner", "epornerdl", "dlxnxx"];
handler.tags = ["nsfw"];
export default handler;