import fetch from "node-fetch"

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed*`);

    m.reply(wait)
    try {
        conn.sendFile(m.chat, `https://api.xyroinee.xyz/api/ai/stablediffusion?q=${encodeURIComponent(text)}&apikey=${global.xyro}`, 'anu.jpg', `Prompt: ${text}`, m)
    } catch (e) {
        m.reply(eror)
    }

}
handler.help = ['stabledif']
handler.tags = ['ai']
handler.command = /^(stabledif)$/i
handler.limit = true
export default handler