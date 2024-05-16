import Jimp from 'jimp';
let handler = async (m, {
    conn,
    args
}) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (/image/.test(mime)) {
            let img = await q.download()
            if (!img) throw new Error(`Foto tidak ditemukan`)
            await conn.updateProfilePicture(conn.user.jid, img)
            conn.reply(m.chat, 'Sukses Mengganti Foto Profile Bot!', m)
        } else {
            throw new Error(`Pesan tidak berisi gambar`)
        }
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, 'Terjadi kesalahan saat menjalankan perintah', m)
    }
}
handler.help = ['botsetpp']
handler.command = /^(botsetpp)$/i
handler.owner = true

export default handler

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