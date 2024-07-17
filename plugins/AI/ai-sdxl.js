import * as Prodia from "prodia.js";
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
    const input_data = await tryModule(prodiaClient.getSDXLModels, getSDXLModels);
    const samplr = await tryModule(prodiaClient.getSDXLSamplers, getSDXLSamplers);
    const styler = await tryModule(getModels);
    let [urutan, tema] = text.split("|");
    if (!tema) return m.reply("Input query!\n*Example:*\n.sdxl [nomor]|[query]");
    m.react("wait");
    let data = _.map(input_data, (item, index) => ({
      title: item.replace(/[_-]/g, " ").replace(/\..*/, ""),
      id: item
    }));
    if (!urutan || isNaN(urutan) || urutan > data.length) {
      return m.reply("Input query!\n*Example:*\n.sdxl [nomor]|[query]\n\n*Pilih angka yg ada*\n" + _.map(data, (item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    }
    let out = _.get(data[urutan - 1], "id");
    const generateImageParams = {
      model: out,
      prompt: encodeURIComponent(tema),
      sampler: _.sample(samplr),
      style_preset: _.sample(_.get(styler, "[10].enum", [])),
      cfg_scale: 9,
      steps: 30
    };
    const openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse;
      const tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: _.get(result, "imageUrl")
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
    console.error("Error in sdxl handler:", e);
    m.react("eror");
  }
};
handler.help = ["sdxl *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(sdxl)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodiaClient.generateImageSDXL(params);
  while (generate?.status !== "succeeded" && generate?.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodiaClient.getJob(generate.job);
    if (job?.status === "succeeded") return job;
  }
}
async function tryModule(primaryModuleFn, alternateFn) {
  try {
    return await primaryModuleFn.call(prodiaClient);
  } catch (error) {
    console.error("Error using primary module, trying alternate:", error);
    return await alternateFn();
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/sdxl-generate");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => _.has(obj, "enum"));
  } catch (error) {
    console.error("Error fetching or filtering JSON:", error);
    return [];
  }
}
async function getSDXLModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/sdxl-models");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => _.has(obj, "enum"));
  } catch (error) {
    console.error("Error fetching or filtering SDXL models:", error);
    return [];
  }
}
async function getSDXLSamplers() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/sdxl-samplers");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return allJSON;
  } catch (error) {
    console.error("Error fetching SDXL samplers:", error);
    return [];
  }
}
