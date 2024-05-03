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
    const input_data = await prodia.getModels();
    const samplr = await prodia.getSamplers();
    const styler = await getModels();

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw 'No media found'
    let media = await q.download()
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : uploadFile)(media)

    let [urutan, tema] = text.split("|")
    if (!tema) return m.reply("Input query!\n*Example:*\n.sdxlinpaint [nomor]|[query]")

    await m.reply(wait)
    try {
        let data = input_data.map((item, index) => ({
            title: item.replace(/[_-]/g, ' ').replace(/\..*/, ''),
            id: item
        }));
        if (!urutan) return m.reply("Input query!\n*Example:*\n.sdxlinpaint [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.sdxlinpaint [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.sdxlinpaint [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        let out = data[urutan - 1].id

        let imgdata = media.toString('base64')
        const generateImageParams = {
            imageUrl: link,
            imageData: imgdata,
            maskUrl: link,
            maskData: imgdata,
            prompt: encodeURIComponent(tema),
            model: out,
            sampler: samplr.getRandom(),
            style_preset: (styler[10]?.enum).getRandom(),
            mask_blur: 4,
            inpainting_fill: 0,
            inpainting_mask_invert: 1,
            inpainting_full_res: true,
            cfg_scale: 9,
            steps: 30,
            width: 512,
            height: 768
        };
        const openAIResponse = await generateImage(generateImageParams);

        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result.imageUrl
                },
                caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
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
handler.help = ["sdxlinpaint *[nomor]|[query]*"]
handler.tags = ["ai"]
handler.command = /^(sdxlinpaint)$/i
export default handler

async function generateImage(params) {
    const generate = await prodia.inpaintingSDXL(params);
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
        const response = await fetch('https://docs.prodia.com/reference/sdxl-inpainting');
        const html = await response.text();
        const jsonRegex = /{&quot;[^{}]*}/g;
        const allJSON = html.match(jsonRegex)?.map(match => JSON.parse(match.replace(/&quot;/g, '"'))) || [];
        const data = allJSON.filter(obj => obj.enum !== undefined);
        return data;
    } catch (error) {
        throw new Error('Error fetching or filtering JSON:', error);
    }
}