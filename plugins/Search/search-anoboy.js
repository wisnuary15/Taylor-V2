import {
  anoboy
} from "../../lib/scraper/all/anime.js";
const handler = async (m, {
  text
}) => {
  let [query, index, chapter] = text.trim().split("|");
  try {
    if (!query) {
      return m.reply("ℹ️ Masukkan query untuk mencari konten di Anoboy.\nContoh penggunaan: anoboy Naruto");
    }
    if (!index && !chapter) {
      const searchResult = await anoboy.search(query);
      if (searchResult.length === 0) {
        return m.reply(`Tidak ditemukan hasil untuk query "${query}".`);
      }
      const resultsList = searchResult.map((result, idx) => {
        return `Konten ${idx + 1}:
- Judul: ${result.title}
- Upload: ${result.upload}
- Link: ${result.url}`;
      }).join("\n\n");
      return m.reply(`Daftar konten untuk query "${query}":\n\n${resultsList}`);
    }
    index = parseInt(index);
    chapter = parseInt(chapter);
    if (isNaN(index) || index <= 0) {
      return m.reply("ℹ️ Indeks tidak valid. Mohon berikan nomor antara 1 dan jumlah hasil pencarian.");
    }
    const searchResult = await anoboy.search(query);
    if (index > searchResult.length) {
      return m.reply(`ℹ️ Indeks tidak valid. Mohon berikan nomor antara 1 dan ${searchResult.length}.`);
    }
    const selectedResult = searchResult[index - 1];
    if (!chapter) {
      const detailResult = await anoboy.detail(selectedResult.url);
      if (!detailResult || Object.keys(detailResult).length === 0) {
        return m.reply(`Tidak dapat mengambil informasi untuk konten "${selectedResult.title}".`);
      }
      let replyMessage = `Detail untuk konten "${selectedResult.title}":
- Judul: ${detailResult.title}
- Episode: ${detailResult.episode}
- Upload: ${detailResult.upload}
- Deskripsi: ${detailResult.desc}
- Gambar: ${detailResult.image}
- Link: ${selectedResult.url}`;
      return m.reply(replyMessage);
    }
    if (isNaN(chapter) || chapter <= 0) {
      return m.reply("ℹ️ Chapter tidak valid. Mohon berikan nomor antara 1 dan jumlah episode yang tersedia.");
    }
    const detailResult = await anoboy.detail(selectedResult.url);
    if (!detailResult || !detailResult.download || !detailResult.download[chapter - 1]) {
      return m.reply(`Tidak ditemukan link download untuk episode ${chapter} dari konten "${selectedResult.title}".`);
    }
    const downloadLinks = detailResult.download[chapter - 1].map((link, idx) => {
      return `  - Link ${idx + 1}: ${link}`;
    }).join("\n");
    m.reply(`Link download untuk episode ${chapter} dari konten "${selectedResult.title}":\n\n${downloadLinks}`);
  } catch (e) {
    console.error("Error:", e);
    m.react("❌");
    m.reply("Terjadi kesalahan saat memproses permintaan Anda.");
  }
};
handler.help = ["anoboy <query>|<index>|<chapter>", "anoboy <query>|<index>", "anoboy <query>"];
handler.command = ["anoboy"];
handler.tags = ["search"];
export default handler;
