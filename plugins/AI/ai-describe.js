import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import axios from 'axios'

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
    let isTele = /image\/(png|jpe?g)|webp\//.test(mime)
    if (!isTele) throw 'Mime not support'
    let link = await (isTele ? uploadImage : uploadFile)(media)

    await m.reply(wait)
    try {
        const openAIResponse = await describe(link);
        if (openAIResponse) {
            const result = openAIResponse;

            await m.reply(result)
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
    console.error(e)
        await m.reply(eror)
    }
}
handler.help = ["describe *[Reply image]*"]
handler.tags = ["ai"]
handler.command = /^(describe)$/i
export default handler

async function describe(logo) {
    try {
        const response = await axios.get("https://www.api.vyturex.com/describe?url=" + encodeURIComponent(logo));
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}