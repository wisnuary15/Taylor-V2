import {
  Sticker
} from "wa-sticker-formatter";
import {
  emojiGraph,
  searchEmoji,
  emojiPedia,
  NotoEmoji,
  EmojiGG
} from "../../lib/scraper/scraper-search.js";
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  try {
    if (!args[0]) {
      return m.reply(`*⛌ Masukkan emoji atau perintah yang benar*\n\n- *Example:*\n- ${usedPrefix + command} 🗿\n- ${usedPrefix + command} emoji_query`);
    }
    let stiker;
    switch (command) {
      case "emo":
      case "emoji":
      case "emojis":
        const url = await searchEmoji(args[0]);
        const res = await emojiGraph(url[0]);
        const emojiData = res[0]?.vendors;
        if (!emojiData.length) {
          return m.reply("❌ Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.");
        }
        if (!args[1]) {
          return m.reply(`Daftar vendor untuk *${args[0]}*:\n\n${emojiData.map((data, index) => `*${index + 1}.* ${data.name}`).join("\n")}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`);
        }
        const vendorIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorIndex) || vendorIndex < 0 || vendorIndex >= emojiData.length) {
          return m.reply(`Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiData.length}.`);
        }
        const vendorData = emojiData[vendorIndex];
        m.react(wait);
        await m.reply(`Informasi emoji untuk *${args[0]}* (${vendorData.name}):\n\n*Url:* ${vendorData.link}\n*Gambar:* ${vendorData.image}`);
        stiker = await createSticker(null, vendorData.image, packname, m.name, 60);
        return m.reply(stiker);
      case "notoemoji":
        const emojiUrl = await NotoEmoji(args[0]);
        if (emojiUrl) {
          m.react(wait);
          stiker = await createSticker(null, emojiUrl, packname, m.name, 60);
          return m.reply(stiker);
        }
        return m.reply("❌ Gagal mendapatkan URL emoji.");
      case "emojigg":
        const emojiGgData = await EmojiGG(args[0]);
        if (!emojiGgData.length) {
          return m.reply("❌ Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.");
        }
        if (!args[1]) {
          return m.reply(`Daftar vendor untuk *${args[0]}*:\n\n${emojiGgData.map((data, index) => `*${index + 1}.* ${data.title}`).join("\n")}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`);
        }
        const vendorGgIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorGgIndex) || vendorGgIndex < 0 || vendorGgIndex >= emojiGgData.length) {
          return m.reply(`Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiGgData.length}.`);
        }
        const vendorGgData = emojiGgData[vendorGgIndex];
        m.react(wait);
        await m.reply(`Informasi emoji untuk *${args[0]}* (${vendorGgData.title}):\n\n*Description:* ${vendorGgData.description}\n*Gambar:* ${vendorGgData.image}`);
        stiker = await createSticker(null, vendorGgData.image, packname, m.name, 60);
        return m.reply(stiker);
      case "emojipedia":
        const emojiPeData = await emojiPedia(args[0]);
        if (!emojiPeData.length) {
          return m.reply("❌ Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.");
        }
        if (!args[1]) {
          return m.reply(`Daftar vendor untuk *${args[0]}*:\n\n${emojiPeData.map((data, index) => `*${index + 1}.* ${data.name}`).join("\n")}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`);
        }
        const vendorPeIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorPeIndex) || vendorPeIndex < 0 || vendorPeIndex >= emojiPeData.length) {
          return m.reply(`Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiPeData.length}.`);
        }
        const vendorPeData = emojiPeData[vendorPeIndex];
        m.react(wait);
        await m.reply(`Informasi emoji untuk *${args[0]}* (${vendorPeData.name}):\n\n*Description:* ${vendorPeData.description}\n*Gambar:* ${vendorPeData.image}`);
        stiker = await createSticker(null, vendorPeData.image, packname, m.name, 60);
        return m.reply(stiker);
      default:
        return m.reply("Perintah tidak valid.");
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    m.react(eror);
  }
};
handler.help = ["emoji", "notoemoji", "emojigg", "emojipedia"];
handler.tags = ["sticker"];
handler.command = /^(emo(jis|ji)?|notoemoji|emojigg|emojipedia)$/i;
export default handler;
async function createSticker(img, url, packName, authorName, quality) {
  try {
    return await new Sticker(img || url, {
      type: "full",
      pack: packName,
      author: authorName,
      quality: quality
    }).toBuffer();
  } catch (error) {
    console.error("Error creating sticker:", error);
  }
}
