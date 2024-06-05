import axios from "axios"
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
        let data = await textToImage(text)
        if (data) {
            conn.sendFile(m.chat, data.result_url, '', `Image for ${text}`, m, false, {
                mentions: [m.sender]
            });
        }
    } catch (e) {
        console.error(e)
        m.reply(eror)
    }
}
handler.help = ["photoleap"]
handler.tags = ["ai"];
handler.command = /^(photoleap)$/i
export default handler
/* New Line */
async function textToImage(text) {
    try {
        const {
            data
        } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text)
        return data;
    } catch (err) {
        return null;
    }
}
