import {
  Prodia
} from "prodia.js";
import fetch from "node-fetch";
import _ from "lodash";
import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
const prodiaClient = Prodia(_.sample([...prodiaKey]));
const isUrl = text => text.match(new RegExp(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|png)/, "gi"));
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    const q = m.quoted || m;
    if (!text || !isUrl(text)) {
      return m.reply(`❓ *Query input tidak valid!*\n\nPastikan input adalah link gambar.\nContoh penggunaan:\n${usedPrefix + command} [link gambar]`);
    }
    const prompt = text.trim();
    const mime = (q.msg || q).mimetype || "";
    if (!mime) return m.reply("Tidak ada media yang ditemukan");
    const media = await q.download();
    const link = await (/image\/(png|jpe?g|gif)|video\/mp4/.test(mime) ? uploadImage : uploadFile)(media);
    const generateImageParams = {
      sourceUrl: link,
      targetUrl: prompt
    };
    const result = await generateImage(generateImageParams);
    if (result) {
      await conn.sendMessage(m.chat, {
        image: {
          url: result?.imageUrl || thumb
        },
        caption: `✨ *Gambar berhasil dibuat!*\n- Link: *${link}*\n- *Request oleh:* @${m.sender.split("@")[0]}\n- *Prompt:* ${prompt}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
      m.react(sukses);
    } else {
      m.react(eror);
    }
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["faceswap *[link gambar]*"];
handler.tags = ["ai"];
handler.command = /^(faceswap)$/i;
export default handler;
async function generateImage(params) {
  try {
    const generate = await prodiaClient.faceSwap(params);
    return await prodiaClient.wait(generate) || null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}