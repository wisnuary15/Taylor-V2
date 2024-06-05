import fetch from 'node-fetch';
import bo from 'dhn-api';
const handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {
    try {
        let spas = "                ";
        const joke = await bo.Darkjokes();
        const message = `*[ DARKJOKE ]*\nPermintaan oleh:\n${m.name}`;
        conn.sendFile(m.chat, joke, '', message, m);
    } catch (err) {
        console.error(err);
        conn.reply(m.chat, 'Terjadi kesalahan saat mengambil joke. Silakan coba lagi nanti.', m);
    }
};
handler.help = ['darkjoke'];
handler.tags = ['fun'];
handler.command = /^(darkjoke)$/i;
export default handler;
