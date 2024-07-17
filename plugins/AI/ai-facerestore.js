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
    const samplr = await getModels();
    const q = m.quoted ?? m;
    const mime = q.msg?.mimetype;
    if (!mime) throw "No media found";
    const media = await q.download?.();
    const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    const link = await (isTele ? uploadImage : uploadFile)(media);
    m.react(wait);
    const generateImageParams = {
      imageUrl: link,
      imageData: media?.toString("base64"),
      model: _.get(samplr, "[9].enum", [])?.getRandom(),
      resize: 4
    };
    const openAIResponse = await generateImage(generateImageParams);
    if (openAIResponse) {
      const result = openAIResponse;
      const tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: {
          url: result.imageUrl
        },
        caption: `Here's the *upscale* effect\nRequested by: ${tag}`,
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
handler.help = ["facerestore *[Reply image]*"];
handler.tags = ["ai"];
handler.command = /^(facerestore)$/i;
export default handler;
async function generateImage(params) {
  const generate = await prodiaClient.faceRestore(params);
  while (generate.status !== "succeeded" && generate.status !== "failed") {
    await new Promise(resolve => setTimeout(resolve, 250));
    const job = await prodiaClient.getJob(generate.job);
    if (job.status === "succeeded") return job;
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/upscale");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, "\""))) || [];
    return _.filter(allJSON, obj => _.has(obj, "enum"));
  } catch (error) {
    console.error("Error fetching or filtering JSON:", error);
    return [];
  }
}
