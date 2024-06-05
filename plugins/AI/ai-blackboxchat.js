import {
    Blackbox
} from "../../lib/ai/blackbox.js";
const blackbox = new Blackbox();
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    m.reply(wait)
    try {
        const input = [{
            role: "user",
            content: text
        }]
        const data = await blackbox.chat(input, "Realtime", true, false, false, false)
        if (data) m.reply(data)
    } catch (e) {
        m.reply(eror)
    }
}
handler.help = ["blackboxchat"]
handler.tags = ["ai"];
handler.command = /^(blackboxchat)$/i
export default handler
