import {
    webp2png
} from '../../lib/webp2mp4.js';
import {
    URL_REGEX
} from '@whiskeysockets/baileys';

let handler = async (m, {
    conn,
    args
}) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        let updateMsg = 'Success update profile picture';

        if (/image/.test(mime)) {
            let url = await webp2png(await q.download());
            await conn.updateProfilePicture(m.chat, {
                url
            });
        } else if (args[0] && args[0].match(URL_REGEX)) {
            await conn.updateProfilePicture(m.chat, {
                url: args[0]
            });
        } else {
            throw new Error('Where\'s the media?');
        }

        m.reply(updateMsg);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan saat menjalankan perintah', m);
    }
};

handler.help = ['setppgrup'];
handler.tags = ['group'];
handler.alias = ['setppgc', 'setppgrup', 'setppgroup'];
handler.command = /^setpp(gc|grup|group)$/i;
handler.group = handler.admin = handler.botAdmin = true;

export default handler;