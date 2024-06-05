import {
    Prodia
} from "prodia.js";
const apiKey = ["dc80a8a4-0b98-4d54-b3e4-b7c797bc2527"];
const prodia = Prodia(apiKey.getRandom());
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import fetch from 'node-fetch'
const handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    const samplr = await getModels();
    const input_data = samplr[6].enum;
    const input_dataa = samplr[7].enum;
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw 'No media found'
    let media = await q?.download()
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : uploadFile)(media)
    let [urutan, tema] = text.split("|")
    if (!tema) return m.reply("Input query!\n*Example:*\n.controlnet [nomor]|[query]")
    m.reply(wait)
    try {
        let data = input_data?.map((item, index) => ({
            title: item.replace(/[_-]/g, ' ').replace(/\..*/, ''),
            id: item
        }));
        if (!urutan) return m.reply("Input query!\n*Example:*\n.controlnet [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data?.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.controlnet [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data?.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.controlnet [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data?.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"))
        let out = data[urutan - 1].id
        let outt = input_dataa[urutan - 1]
        let imgdata = media.toString('base64')
        const generateImageParams = {
            imageUrl: link,
            imageData: imgdata,
            controlnet_model: out,
            controlnet_module: outt,
            prompt: encodeURIComponent(tema),
            style_preset: (samplr[10].enum).getRandom(),
            cfg_scale: 10
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
        console.error(e)
        m.reply(eror)
    }
}
handler.help = ["controlnet *[nomor]|[query]*"]
handler.tags = ["ai"]
handler.command = /^(controlnet)$/i
export default handler
async function generateImage(params) {
    const generate = await prodia.controlNet(params);
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
        const response = await fetch('https://docs.prodia.com/reference/controlnet');
        const html = await response.text();
        const jsonRegex = /{&quot;[^{}]*}/g;
        const allJSON = html.match(jsonRegex)?.map(match => JSON.parse(match.replace(/&quot;/g, '"'))) || [];
        const data = allJSON?.filter(obj => obj.enum !== undefined);
        return data;
    } catch (error) {
        throw new Error('Error fetching or filtering JSON:', error);
    }
}
