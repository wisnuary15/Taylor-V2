import fs from 'fs';
import Jimp from 'jimp';

let handler = async (m, {
    conn,
    command,
    usedPrefix
}) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';
        m.reply('Tunggu sebentar...');

        if (/image/.test(mime) && !/webp/.test(mime)) {
            let media = await q.download();
            let botNumber = conn.user.jid;
            let {
                img
            } = await generateProfilePicture(media);

            await conn.query({
                tag: 'iq',
                attrs: {
                    to: botNumber,
                    type: 'set',
                    xmlns: 'w:profile:picture'
                },
                content: [{
                    tag: 'picture',
                    attrs: {
                        type: 'image'
                    },
                    content: img
                }]
            });

            m.reply('Sukses mengganti PP Bot');
        } else {
            m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`);
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan, coba lagi nanti.');
    }
};

handler.menu = ['setppfull'];
handler.tags = ['owner'];
handler.command = /^setpp(panjang|full|f|2)$/i;
handler.owner = true;

export default handler;

async function generateProfilePicture(media) {
    const jimp = await Jimp.read(media);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
        img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
        preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
    };
}