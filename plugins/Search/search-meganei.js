import {
  meganei
} from "../../lib/scraper/all/anime.js";
const handler = async (m, {
  text
}) => {
  let [query, index, chapter] = text.trim().split("|");
  m.react(wait);
  try {
    if (!query) {
      return m.reply("ℹ️ Masukkan query untuk mencari anime.\nContoh penggunaan: meganei cute");
    }
    if (!index && !chapter) {
      const searchResult = await meganei.search(query);
      if (searchResult.total === 0) {
        return m.reply(`Tidak ditemukan hasil untuk query "${query}".`);
      }
      const resultsList = searchResult.result.map((result, idx) => {
        return `*${idx + 1}. ${result.title}*\n🖼️ Thumbnail: ${result.thumbnail}\n📅 Publisher: ${result.publisher}\n📚 Categories: ${result.category.join(", ")}\n🏷️ Tags: ${result.tag.join(", ")}\n🔗 Link: ${result.link}`;
      }).join("\n\n");
      return m.reply(`Daftar anime untuk query "${query}":\n\n${resultsList}`);
    }
    index = parseInt(index);
    chapter = parseInt(chapter);
    if (isNaN(index) || index <= 0) {
      return m.reply("ℹ️ Indeks tidak valid. Mohon berikan nomor antara 1 dan maksimal jumlah hasil pencarian.");
    }
    const searchResult = await meganei.search(query);
    if (index > searchResult.total) {
      return m.reply(`ℹ️ Indeks tidak valid. Mohon berikan nomor antara 1 dan ${searchResult.total}.`);
    }
    const selectedResult = searchResult.result[index - 1];
    if (!chapter) {
      const infoResult = await meganei.info(selectedResult.link);
      const chaptersList = infoResult.download.map((chapter, idx) => `*${idx + 1}. Chapter ${idx + 1}:*\n${chapter.link.map(link => `   • ${link.type}: ${link.link}`).join("\n")}`).join("\n\n");
      return m.reply(`Link download untuk anime "${selectedResult.title}":\n\n${chaptersList}`);
    }
    if (isNaN(chapter) || chapter <= 0) {
      return m.reply("ℹ️ Chapter tidak valid. Mohon berikan nomor antara 1 dan jumlah chapter yang tersedia.");
    }
    const infoResult = await meganei.info(selectedResult.link);
    if (chapter > infoResult.download.length) {
      return m.reply(`ℹ️ Chapter tidak valid. Mohon berikan nomor antara 1 dan ${infoResult.download.length}.`);
    }
    const downloadLinks = infoResult.download[chapter - 1].link.map(link => `• ${link.type}: ${link.link}`).join("\n");
    if (!downloadLinks) {
      return m.reply(`Tidak ditemukan link download untuk chapter ${chapter} dari anime "${selectedResult.title}".`);
    }
    m.reply(`*Link download untuk ${selectedResult.title} Chapter ${chapter}:*\n\n${downloadLinks}`);
  } catch (e) {
    console.error("Error:", e);
    m.react(eror);
  }
};
handler.help = ["meganei <query>|<index>|<chapter>", "meganei <query>|<index>", "meganei <query>"];
handler.command = ["meganei"];
handler.tags = ["search"];
export default handler;