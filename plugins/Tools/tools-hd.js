import {
    VyroAI
} from "../../lib/ai/vyro-ai.js";
import {
    ImageProcessor
} from "../../lib/tools/art-enhance.js";
import axios from 'axios';
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
const genAi = new VyroAI({
    link: false,
    buffer: true
});
const generate = new ImageProcessor({
    token: '',
    replicate: "3a4886dd3230e523600d3b555f651dc82aba3a4e"
});
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        try {
            let media = await q?.download();
            let isTele = /^image\/(png|jpe?g|gif)/.test(mime);
            let link = await (isTele ? uploadImage : uploadFile)(media);
            let sauce = await Upscale(link);
            conn.sendFile(m.chat, sauce, '', '', m);
        } catch (e) {
            try {
                let media = await q?.download();
                let sauce = await genAi.upscaleImage(media);
                conn.sendFile(m.chat, sauce.buffer, '', '', m);
            } catch (e) {
                try {
                    let media = await q?.download();
                    let sauce = await generate.upscaleImage(media);
                    conn.sendFile(m.chat, sauce, '', '', m);
                } catch (e) {
                    try {
                        let media = await q?.download();
                        let sauce = await generate.artEnhance(media);
                        conn.sendFile(m.chat, sauce, '', '', m);
                    } catch (e) {
                        m.reply("Error saat meningkatkan kualitas gambar");
                    }
                }
            }
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim`);
    }
};
handler.help = ['hd', 'enhance'];
handler.tags = ['tools'];
handler.command = /^(hd|enhance)$/i;
export default handler;
async function Upscale(so) {
    try {
        const response = await axios.get(`https://www.api.vyturex.com/upscale?imageUrl=${so}`);
        return response.data.resultUrl;
    } catch (error) {
        throw new Error('Error fetching or filtering JSON:', error);
    }
}
