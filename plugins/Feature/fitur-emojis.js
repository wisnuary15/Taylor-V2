import {
  sticker
} from '../../lib/sticker.js';
import {
  emojiGraph,
  searchEmoji,
  emojiPedia,
  NotoEmoji,
  EmojiGG
} from '../../lib/scraper/scraper-search.js';
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  try {
    if (!args[0]) return m.reply('Silakan masukkan *emoji* atau perintah yang benar.');
    switch (command) {
      case 'emo':
      case 'emoji':
      case 'emojis':
        const url = await searchEmoji(args[0]);
        const res = await emojiGraph(url[0]);
        const emojiData = res[0]?.vendors;
        if (!emojiData.length) return m.reply('Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.');
        if (!args[1]) return m.reply(
          `Daftar vendor untuk *${args[0]}*:\n\n${emojiData.map((data, index) => `*${index + 1}.* ${data.name}`).join('\n')}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`
          );
        const vendorIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorIndex) || vendorIndex < 0 || vendorIndex >= emojiData.length) return m.reply(
          `Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiData.length}.`);
        const vendorData = emojiData[vendorIndex];
        m.reply(
          `Informasi emoji untuk *${args[0]}* (${vendorData.name}):\n\n*Url:* ${vendorData.link}\n*Gambar:* ${vendorData.image}`
          );
        return m.reply(await sticker(false, vendorData.image, packname, m.name));
        break;
      case 'notoemoji':
        const emojiUrl = await NotoEmoji(args[0]);
        if (emojiUrl) return m.reply(emojiUrl);
        else return m.reply('Gagal mendapatkan URL emoji.');
        break;
      case 'emojigg':
        const emojiGgData = await EmojiGG(args[0]);
        if (!emojiGgData.length) return m.reply('Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.');
        if (!args[1]) return m.reply(
          `Daftar vendor untuk *${args[0]}*:\n\n${emojiGgData.map((data, index) => `*${index + 1}.* ${data.title}`).join('\n')}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`
          );
        const vendorGgIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorGgIndex) || vendorGgIndex < 0 || vendorGgIndex >= emojiGgData.length) return m.reply(
          `Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiGgData.length}.`
          );
        const vendorGgData = emojiGgData[vendorGgIndex];
        m.reply(
          `Informasi emoji untuk *${args[0]}* (${vendorGgData.title}):\n\n*Description:* ${vendorGgData.description}\n*Gambar:* ${vendorGgData.image}`
          );
        return m.reply(await sticker(false, vendorGgData.image, packname, m.name));
        break;
      case 'emojipedia':
        const emojiPeData = await emojiPedia(args[0]);
        if (!emojiPeData.length) return m.reply('Emoji tidak ditemukan atau input tidak valid. Silakan coba lagi.');
        if (!args[1]) return m.reply(
          `Daftar vendor untuk *${args[0]}*:\n\n${emojiPeData.map((data, index) => `*${index + 1}.* ${data.name}`).join('\n')}\n\nContoh: *${usedPrefix + command}* [emoji] [vendor]`
          );
        const vendorPeIndex = parseInt(args[1]) - 1;
        if (isNaN(vendorPeIndex) || vendorPeIndex < 0 || vendorPeIndex >= emojiPeData.length) return m.reply(
          `Indeks vendor tidak valid. Harap berikan nomor yang valid dari angka 1 sampai ${emojiPeData.length}.`
          );
        const vendorPeData = emojiPeData[vendorPeIndex];
        m.reply(
          `Informasi emoji untuk *${args[0]}* (${vendorPeData.name}):\n\n*Description:* ${vendorPeData.description}\n*Gambar:* ${vendorPeData.image}`
          );
        return m.reply(await sticker(false, vendorPeData.image, packname, m.name));
        break;
    }
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return m.reply('Terjadi kesalahan saat mencari data emoji.');
  }
};
handler.help = ['emoji', 'notoemoji', 'emojigg', 'emojipedia'];
handler.tags = ['sticker'];
handler.command = /^(emo(jis|(ji)?)|notoemoji|emojigg|emojipedia)$/i;
export default handler;
