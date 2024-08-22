import {
  Hat
} from "../../lib/ai/ai-hat.js";
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  try {
    const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
    if (!text) {
      return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    }
    m.react(wait);
    const result = await new Hat().main(text);
    if (!result) return m.reply("⚠️ Tidak ada hasil.");
    const {
      similarQuestions = [],
        sources = [],
        chatResult
    } = result;
    let responseMessage = `✨ *Hasil Pencarian AI-Hat* ✨\n\n`;
    responseMessage += similarQuestions.length ? `💡 *Pertanyaan Serupa*:\n${similarQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\n` : "";
    responseMessage += sources.length ? `📚 *Sumber Informasi*:\n${sources.map((s, i) => `${i + 1}. [${s.name}](${s.url})`).join("\n")}\n\n` : "";
    responseMessage += chatResult ? `💬 *Hasil*:\n${chatResult}\n` : "";
    await conn.reply(m.chat, responseMessage, m);
  } catch (error) {
    console.error("Error:", error);
    m.reply("⚠️ Terjadi kesalahan.");
  }
};
handler.help = ["aihat <kata kunci>"];
handler.tags = ["ai"];
handler.command = /^(aihat)$/i;
handler.limit = true;
export default handler;