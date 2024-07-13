import {
  Prodia
} from "prodia.js";
const apiKey = ["dc80a8a4-0b98-4d54-b3e4-b7c797bc2527"],
  prodia = Prodia(apiKey.getRandom());
import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
import fetch from "node-fetch";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  const samplr = await getModels();
  let q = m.quoted ? m.quoted : m,
    mime = (q.msg || q).mimetype || "";
  if (!mime) throw "No media found";
  let media = await q?.download(),
    isTele = /^image\/(png|jpe?g|gif)/.test(mime),
    link = await (isTele ? uploadImage : uploadFile)(media);
  m.react(wait);
  try {
    const generateImageParams = {
        imageUrl: link,
        imageData: media.toString("base64"),
        model: samplr[9].enum.getRandom(),
        resize: 4
      },
      openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse,
        tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: result.imageUrl
        },
        caption: `Nih effect *upscale* nya\nRequest by: ${tag}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["tohdx *[Reply image]*"], handler.tags = ["ai"], handler.command = /^(tohdx)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodia.upscale(params);
  for (;
    "succeeded" !== generate.status && "failed" !== generate.status;) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodia.getJob(generate.job);
    if ("succeeded" === job.status) return job;
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/upscale"),
      html = await response.text(),
      jsonRegex = /{&quot;[^{}]*}/g,
      allJSON = html.match(jsonRegex).map(match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return allJSON.filter(obj => void 0 !== obj.enum);
  } catch (error) {
    throw new Error("Error fetching or filtering JSON:", error);
  }
}
