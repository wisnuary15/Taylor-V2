import * as Prodia from "prodia.js";
import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
import fetch from "node-fetch";
import _ from "lodash";
const apiKey = ["dc80a8a4-0b98-4d54-b3e4-b7c797bc2527"];
const prodiaClient = Prodia.default(_.sample([...prodiaKey, apiKey]));
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  try {
    const input_data = await tryModule(prodiaClient.getModels, getModels);
    const samplr = await tryModule(prodiaClient.getSamplers, getSamplers);
    const styler = await tryModule(prodiaClient.getModels, getModels);
    const q = m.quoted ?? m;
    const mime = q.msg?.mimetype || "";
    if (!mime) throw "No media found";
    const media = await q.download?.();
    const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    const link = await (isTele ? uploadImage : uploadFile)(media);
    let [urutan, tema] = text.split("|");
    if (!tema) return m.reply("Input query!\n*Example:*\n.inpaint [nomor]|[query]");
    m.react(wait);
    const data = _.map(input_data, (item, index) => ({
      title: item.replace(/[_-]/g, " ").replace(/\..*/, ""),
      id: item
    }));
    if (!urutan || isNaN(urutan) || urutan > data.length) {
      return m.reply("Input query!\n*Example:*\n.inpaint [nomor]|[query]\n\n*Pilih angka yang ada*\n" + _.map(data, (item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    }
    const out = _.get(data[urutan - 1], "id");
    const imgdata = media?.toString("base64");
    const generateImageParams = {
      imageUrl: link,
      imageData: imgdata,
      maskUrl: link,
      maskData: imgdata,
      prompt: encodeURIComponent(tema),
      model: out,
      sampler: _.sample(samplr),
      style_preset: _.sample(_.get(styler, "[10].enum", [])),
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
      const tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: result.imageUrl
        },
        caption: `Here's the effect *${out}* requested by: ${tag}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else {
      console.log("No response from OpenAI or an error occurred.");
    }
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["inpaint *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(inpaint)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodiaClient.inpainting(params);
  while (generate.status !== "succeeded" && generate.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodiaClient.getJob(generate.job);
    if (job.status === "succeeded") return job;
  }
}
async function tryModule(primaryModuleFn, alternateFn) {
  try {
    return await primaryModuleFn?.call(prodiaClient) ?? await alternateFn();
  } catch (error) {
    console.error("Error using primary module, trying alternate:", error);
    return null;
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/inpainting");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => _.has(obj, "enum"));
  } catch (error) {
    console.error("Error fetching or filtering JSON:", error);
    return [];
  }
}
async function getSamplers() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/samplers");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return allJSON;
  } catch (error) {
    console.error("Error fetching samplers:", error);
    return [];
  }
}
