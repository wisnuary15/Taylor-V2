import {
    enhanceImg,
} from '../../lib/scraper/scraper-toolv2.js';
import {
    Uploader
} from "../../lib/tools/uploader.js";
const upload = new Uploader();
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import fetch from 'node-fetch'
let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw 'No media found'
    let media = await q.download()
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : (upload.uploadPomf2 ? upload.uploadPomf2 : uploadFile))(media)

    await m.reply(wait)
    try {
        const openAIResponse = await enhanceImg(link, parseInt(args[0]));
        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result
                },
                caption: `Nih effect *enhance* nya\nRequest by: ${tag}`,
                mentions: [m.sender]
            }, {
                quoted: m
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["spyne *[Reply image]*"]
handler.tags = ["tools"]
handler.command = /^(spyne)$/i
export default handler