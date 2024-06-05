import Jimp from 'jimp';
import axios from 'axios';
const processImage = async (inputBuffer, watermarkText) => {
    try {
        const base64String = Buffer.from(inputBuffer, 'binary').toString('base64');
        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const link = 'https://www.drawever.com' + (apiResponse.data.urls[1] || apiResponse.data.urls[0]);
        const {
            data: imageBuffer
        } = await axios.get(link, {
            responseType: 'arraybuffer'
        });
        const image = await Jimp.read(imageBuffer);
        const blackBackground = new Jimp(image.bitmap.width, 50, 0x000000FF);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
        blackBackground.print(font, 10, 10, watermarkText, blackBackground.bitmap.width - 20);
        image.composite(blackBackground, 0, image.bitmap.height - blackBackground.bitmap.height, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 0.5,
            opacitySource: 1
        });
        const outputBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        return outputBuffer;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
const handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (!/image|viewOnce/g.test(mime)) return m.reply(`Reply Media dengan perintah\n*${usedPrefix + command}*`)
        let img = await q?.download()?.()
        let output = await processImage(img, 'Sukses Cik')
        m.reply(output)
    } catch (error) {
        console.error(error);
    }
}
handler.help = ["drawever"]
handler.tags = ['maker']
handler.command = ["drawever"]
export default handler
