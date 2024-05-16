import {
    HuggingFace
} from '../../lib/tools/huggingface.js';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    await m.reply(wait)
    try {
        const MODEL = 'facebook/blenderbot-400M-distill';
        const INPUT = (text);
        const openAIResponse = await HuggingFace(MODEL, INPUT);

        if (openAIResponse) {
            console.log("Respons dari OpenAI:");
            await m.reply(openAIResponse.generated_text);
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        await m.reply(eror);
    }
}
handler.help = ["blenderbot"]
handler.tags = ["fun"]
handler.command = /^blenderbot$/i
export default handler