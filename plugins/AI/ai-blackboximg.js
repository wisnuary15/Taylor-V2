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
    const media = await q.download();
    if (!mime) throw 'Tidak ada media yang ditemukan';
    const text = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text) || (() => {
        throw "Input Teks"
    })();

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