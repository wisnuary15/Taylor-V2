import {
  Prodia
} from "prodia.js";
const apiKey = ["dc80a8a4-0b98-4d54-b3e4-b7c797bc2527"],
  prodia = Prodia(apiKey.getRandom());
import fetch from "node-fetch";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  const input_data = await prodia.getModels(),
    samplr = await prodia.getSamplers(),
    styler = await getModels();
  let [urutan, tema] = text.split("|");
  if (!tema) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]");
  m.react(wait);
  try {
    let data = input_data.map((item, index) => ({
      title: item.replace(/[_-]/g, " ").replace(/\..*/, ""),
      id: item
    }));
    if (!urutan) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    let out = data[urutan - 1].id;
    const generateImageParams = {
        prompt: encodeURIComponent(tema),
        model: out,
        sampler: samplr.getRandom(),
        style_preset: styler[10].enum.getRandom(),
        cfg_scale: 9,
        steps: 30,
        aspect_ratio: "portrait"
      },
      openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse,
        tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: result.imageUrl
        },
        caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
  } catch (e) {
    console.error(e), m.react(eror);
  }
};
handler.help = ["txt2img *[nomor]|[query]*"], handler.tags = ["ai"], handler.command = /^(txt2img)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodia.generateImage(params);
  for (;
    "succeeded" !== generate.status && "failed" !== generate.status;) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodia.getJob(generate.job);
    if ("succeeded" === job.status) return job;
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/generate"),
      html = await response.text(),
      jsonRegex = /{&quot;[^{}]*}/g,
      allJSON = html.match(jsonRegex).map(match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return allJSON.filter(obj => void 0 !== obj.enum);
  } catch (error) {
    throw new Error("Error fetching or filtering JSON:", error);
  }
}
