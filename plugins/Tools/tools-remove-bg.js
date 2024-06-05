import fetch from "node-fetch";
import {
    RemoveBackground,
    RemoveBackgroundV2
} from "../../lib/tools/remove-background.js";
const handler = async (m, {
    conn,
    args
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (/image/.test(mime)) {
        m.reply('Mohon tunggu sebentar...');
        try {
            let media = await q?.download();
            let sauce = await RemoveBackground(media) || await RemoveBackgroundV2(media);
            let buffer;
            if (Buffer.isBuffer(sauce)) {
                buffer = sauce;
            } else {
                const response = await fetch(sauce);
                buffer = await response.arrayBuffer();
            }
            conn.sendFile(m.chat, buffer, '', '', m);
        } catch (error) {
            console.error(error);
            m.reply('Terjadi kesalahan saat memproses gambar.');
        }
    } else {
        throw 'Reply dengan gambar yang ingin dihapus latar belakangnya.';
    }
};
handler.help = ["remobg"];
handler.tags = ["tools"];
handler.command = ["remobg"];
export default handler;
