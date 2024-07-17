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
    const input_data = await tryModule(prodiaClient.getModels, getModels);
    const samplr = await tryModule(prodiaClient.getSamplers, getSamplers);
    const styler = await tryModule(getModels);
    let [urutan, tema] = text.split("|");
    if (!tema) return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]");
    m.react("wait");
    let data = _.map(input_data, (item, index) => ({
      title: item.title.replace(/[_-]/g, " ").replace(/\..*/, ""),
      id: item.id
    }));
    if (!urutan || isNaN(urutan) || urutan > data.length) {
      return m.reply("Input query!\n*Example:*\n.txt2img [nomor]|[query]\n\n*Pilih angka yang ada*\n" + _.map(data, (item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    }
    let out = _.get(data[urutan - 1], "id");
    const generateImageParams = {
      prompt: encodeURIComponent(tema),
      model: out,
      sampler: _.sample(samplr),
      style_preset: _.sample(styler[10]?.enum),
      cfg_scale: 9,
      steps: 30,
      aspect_ratio: "portrait"
    };
    const openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse;
      const tag = `@${m.sender.split("@")[0]}`;
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
    console.error(e);
    m.react("eror");
  }
};
handler.help = ["txt2img *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(txt2img)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodiaClient.generateImage(params);
  while (generate.status !== "succeeded" && generate.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodiaClient.getJob(generate.job);
    if (job.status === "succeeded") return job;
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
    const response = await fetch("https://docs.prodia.com/reference/generate");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = html.match(jsonRegex).map(match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => obj.enum !== undefined);
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
    const allJSON = html.match(jsonRegex).map(match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return allJSON;
  } catch (error) {
    console.error("Error fetching samplers:", error);
    return [];
  }
}
