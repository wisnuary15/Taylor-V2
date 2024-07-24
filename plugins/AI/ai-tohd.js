import {
  Prodia
} from "prodia.js";
import fetch from "node-fetch";
import _ from "lodash";
import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
const prodiaClient = Prodia(_.sample([...prodiaKey]));
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    const database = db.data.database.tohdx;
    const q = m.quoted || m;
    const infoMsg = `❓ *Query input tidak ditemukan!*\n\nContoh penggunaan:\n1. *Mengatur Model:* \`${usedPrefix + command} --model <index>\`\n2. *Mengatur Quality:* \`${usedPrefix + command} --quality <index>\`\n3. *Menampilkan Gambar:* \`${usedPrefix + command} [query] --model <index>\`\n\nPastikan untuk mengganti \`<index>\` dengan nilai yang sesuai.`;
    if (!text) {
      return m.reply(infoMsg);
    }
    const trimmedText = text.trim();
    const modelIndex = parseInt(trimmedText.match(/--model\s+(\d+)/)?.[1] ?? 0, 10) - 1;
    const qualityIndex = parseInt(trimmedText.match(/--quality\s+(\d+)/)?.[1] ?? 0, 10) - 1;
    database[m.chat] = database[m.chat] || {
      model: null,
      quality: null,
      inputData: null
    };
    if (!database[m.chat].inputData) {
      database[m.chat].inputData = await tryModule(getModels, getModels);
    }
    const {
      model = [],
        quality = []
    } = database[m.chat].inputData || await tryModule(getModels, getModels) || {};
    let caption = "";
    if (modelIndex >= 0 && model[modelIndex]) {
      database[m.chat].model = model[modelIndex];
      caption += `✅ *Model berhasil diatur*\n- Model: ${model[modelIndex].replace(/[_-]/g, " ").replace(/\..*/, "")}\n`;
    } else if (modelIndex >= 0 && model.length >= 0) {
      caption += `❌ *Model tidak valid!*\nBerikut daftar model yang tersedia:\n${model.map((item, index) => `*${index + 1}.* ${item.replace(/[_-]/g, " ").replace(/\..*/, "")}`).join("\n")}`;
    }
    if (qualityIndex >= 0 && quality[qualityIndex]) {
      database[m.chat].quality = quality[qualityIndex];
      caption += `✅ *Quality berhasil diatur*\n- Quality: ${quality[qualityIndex]}\n`;
    } else if (qualityIndex >= 0 && quality.length >= 0) {
      caption += `❌ *Quality tidak valid!*\nBerikut daftar quality yang tersedia:\n${quality.map((item, index) => `*${index + 1}.* ${item}`).join("\n")}`;
    }
    if (caption) m.reply(caption);
    const modelToUse = database[m.chat].model || _.sample(model);
    const qualityToUse = database[m.chat].quality || _.sample(quality);
    const mime = (q.msg || q).mimetype || "";
    if (!mime) return m.reply("Tidak ada media yang ditemukan");
    const media = await q.download();
    const link = await (/image\/(png|jpe?g|gif)|video\/mp4/.test(mime) ? uploadImage : uploadFile)(media);
    const generateImageParams = {
      imageUrl: link,
      imageData: media.toString("base64"),
      model: modelToUse,
      resize: qualityToUse
    };
    if (!modelToUse || !qualityToUse) {
      return m.reply(infoMsg);
    }
    m.react(wait);
    const result = await generateImage(generateImageParams);
    if (result) {
      await conn.sendMessage(m.chat, {
        image: {
          url: result?.imageUrl || thumb
        },
        caption: `✨ *Gambar berhasil dibuat!*\n- *Model:* ${modelToUse.replace(/[_-]/g, " ").replace(/\..*/, "")}\n- *Quality:* ${qualityToUse}\n- *Request oleh:* @${m.sender.split("@")[0]}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
      delete database[m.chat].model;
      delete database[m.chat].style;
      delete database[m.chat].sampler;
      m.react(sukses);
    } else {
      m.react(eror);
    }
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["tohdx *[query]* --option"];
handler.tags = ["ai"];
handler.command = /^(tohdx)$/i;
export default handler;
async function upscale(params) {
  try {
    const url = "https://api.prodia.com/v1/upscale";
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Prodia-Key": _.sample([...prodiaKey])
      },
      body: JSON.stringify({
        ...params
      })
    };
    return await fetch(url, options).then(res => res.json());
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
async function generateImage(params) {
  try {
    const generate = await tryModule(prodiaClient.upscale, upscale)(params);
    return await prodiaClient.wait(generate) || null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
async function tryModule(primaryModuleFn, secondModuleFn) {
  try {
    return await primaryModuleFn() || await secondModuleFn();
  } catch (error) {
    console.error("Error using module:", error);
    return await secondModuleFn();
  }
}
async function getModels() {
  try {
    const response = await fetch("https://docs.prodia.com/reference/upscale");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, '"'))) || [];
    const data = _.filter(allJSON, obj => _.has(obj, "enum"));
    return {
      model: data[9]?.["enum"],
      quality: data[15]?.["enum"]
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    return null;
  }
}