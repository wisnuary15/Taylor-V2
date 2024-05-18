import Aichat from "../../lib/ai/aichat.js";
const model = "gpt-3.5-turbo";

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
        const messages = [{
            role: "system",
            content: "Anda adalah asisten yang membantu."
        }, {
            role: "user",
            content: text
        }];

        const output = await Aichat.createAsync(model, messages);
        await m.reply(output);
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ['aichat'];
handler.tags = ['ai'];
handler.command = /^(aichat)$/i;

export default handler;