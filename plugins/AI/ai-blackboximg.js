import {
    Blackbox
} from "../../lib/ai/blackbox.js";
const blackbox = new Blackbox();

const handler = async (m, {
    command,
    usedPrefix,
    conn,
    args
}) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime) throw 'Tidak ada media yang ditemukan';
    const media = await q.download();
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    await m.reply(wait)

    try {
        const data = await blackbox.image(media, input)
        if (data) await m.reply(data);
    } catch (e) {
        console.error("Error:", e);
        await m.reply(eror);
    }
}

handler.help = ["blackboximg"]
handler.tags = ["ai"];
handler.command = /^(blackboximg)$/i

export default handler