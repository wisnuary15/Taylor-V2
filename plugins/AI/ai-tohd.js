import {
    Prodia
} from "prodia.js";
const apiKey = ["dc80a8a4-0b98-4d54-b3e4-b7c797bc2527"];
const prodia = Prodia(apiKey.getRandom());
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
    const samplr = await getModels();
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw 'No media found'
    let media = await q.download();
    let isTele = /^image\/(png|jpe?g|gif)/.test(mime);
    let link = await (isTele ? uploadImage : uploadFile)(media);

    await m.reply(wait)
    try {

        const generateImageParams = {
            imageUrl: link,
            imageData: media.toString('base64'),
            model: (samplr[9]?.enum).getRandom(),
            resize: 4
        };
        const openAIResponse = await generateImage(generateImageParams);
        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result.imageUrl
                },
                caption: `Nih effect *upscale* nya\nRequest by: ${tag}`,
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
handler.help = ["tohdx *[Reply image]*"]
handler.tags = ["ai"]
handler.command = /^(tohdx)$/i
export default handler

async function generateImage(params) {
    const generate = await prodia.upscale(params);
    while (generate.status !== "succeeded" && generate.status !== "failed") {
        await new Promise((resolve) => setTimeout(resolve, 250));
        const job = await prodia.getJob(generate.job);
        if (job.status === "succeeded") {
            return job;
        }
    }
}

async function getModels() {
    try {
        const response = await fetch('https://docs.prodia.com/reference/upscale');
        const html = await response.text();
        const jsonRegex = /{&quot;[^{}]*}/g;
        const allJSON = html.match(jsonRegex)?.map(match => JSON.parse(match.replace(/&quot;/g, '"'))) || [];
        const data = allJSON.filter(obj => obj.enum !== undefined);
        return data;
    } catch (error) {
        throw new Error('Error fetching or filtering JSON:', error);
    }
}