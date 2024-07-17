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
    const samplers = await tryModule(prodiaClient.getSamplers, getSamplers);
    const styles = await tryModule(prodiaClient.getModels, getModels);
    const quotedMessage = m.quoted ?? m;
    const mime = quotedMessage.msg?.mimetype;
    if (!mime) throw "Tidak ada media yang ditemukan.";
    const media = await quotedMessage.download();
    const isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    const fileUrl = await (isImageOrVideo ? uploadImage : uploadFile)(media);
    let [modelNumber, promptText] = text.split("|");
    if (!promptText) {
      return m.reply("Silakan masukkan permintaan efek!\n*Contoh:*\n🖼️ `.img2img [nomor]|[permintaan]`");
    }
    m.react(wait);
    const modelsList = _.map(input_data, item => ({
      title: item.replace(/[_-]/g, " ").replace(/\..*/, ""),
      id: item
    }));
    if (!modelNumber || isNaN(modelNumber) || modelNumber > modelsList.length) {
      return m.reply("Silakan masukkan nomor yang sesuai dari daftar:\n" + _.map(modelsList, (item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    }
    const selectedModel = _.get(modelsList[modelNumber - 1], "id");
    const generateImageParams = {
      imageUrl: fileUrl,
      imageData: media.toString("base64"),
      prompt: encodeURIComponent(promptText),
      model: selectedModel,
      sampler: _.sample(samplers),
      style_preset: _.sample(_.get(styles, "[10].enum")),
      cfg_scale: 9,
      steps: 30,
      width: 512,
      height: 768
    };
    const openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse;
      const userTag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: result.imageUrl
        },
        caption: `Ini hasil efek *${selectedModel}*\nDiminta oleh: ${userTag}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else {
      console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
    }
  } catch (error) {
    console.error(error);
    m.react(eror);
  }
};
handler.help = ["img2img *[nomor]|[permintaan]*"];
handler.tags = ["ai"];
handler.command = /^(img2img)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodiaClient.transform(params);
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
    return await alternateFn();
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/transform");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => _.has(obj, "enum"));
  } catch (error) {
    console.error("Error fetching or filtering JSON:", error);
    return null;
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
    return null;
  }
}
