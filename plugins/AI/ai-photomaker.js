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
    const database = db.data.database.photomaker;
    const q = m.quoted || m;
    const infoMsg = `❓ *Query input tidak ditemukan!*\n\nContoh penggunaan:\n1. *Mengatur Model:* \`${usedPrefix + command} --model <index>\`\n2. *Mengatur Style:* \`${usedPrefix + command} --style <index>\`\n3. *Mengatur Sampler:* \`${usedPrefix + command} --sampler <index>\`\n4. *Menampilkan Gambar:* \`${usedPrefix + command} [query] --model <index> --style <index> --sampler <index>\`\n\nPastikan untuk mengganti \`<index>\` dengan nilai yang sesuai.`;
    if (!text) {
      return m.reply(infoMsg);
    }
    const trimmedText = text.trim();
    const prompt = /^\s*--/.test(trimmedText) ? null : trimmedText.split(/\s--\w+\s\d+/)[0].trim() || null;
    const modelIndex = parseInt(trimmedText.match(/--model\s+(\d+)/)?.[1] ?? 0, 10) - 1;
    const styleIndex = parseInt(trimmedText.match(/--style\s+(\d+)/)?.[1] ?? 0, 10) - 1;
    const samplerIndex = parseInt(trimmedText.match(/--sampler\s+(\d+)/)?.[1] ?? 0, 10) - 1;
    database[m.chat] = database[m.chat] || {
      model: null,
      style: null,
      sampler: null,
      inputData: null
    };
    if (!database[m.chat].inputData) {
      database[m.chat].inputData = await tryModule(getModels, getModels);
    }
    const {
      model = [],
        style = [],
        sampler = []
    } = database[m.chat].inputData || await tryModule(getModels, getModels) || {};
    let caption = "";
    if (modelIndex >= 0 && model[modelIndex]) {
      database[m.chat].model = model[modelIndex];
      caption += `✅ *Model berhasil diatur*\n- Model: ${model[modelIndex].replace(/[_-]/g, " ").replace(/\..*/, "")}\n`;
    } else if (modelIndex >= 0 && model.length >= 0) {
      caption += `❌ *Model tidak valid!*\nBerikut daftar model yang tersedia:\n${model.map((item, index) => `*${index + 1}.* ${item.replace(/[_-]/g, " ").replace(/\..*/, "")}`).join("\n")}`;
    }
    if (styleIndex >= 0 && style[styleIndex]) {
      database[m.chat].style = style[styleIndex];
      caption += `✅ *Style berhasil diatur*\n- Style: ${style[styleIndex]}\n`;
    } else if (styleIndex >= 0 && style.length >= 0) {
      caption += `❌ *Style tidak valid!*\nBerikut daftar style yang tersedia:\n${style.map((item, index) => `*${index + 1}.* ${item}`).join("\n")}`;
    }
    if (samplerIndex >= 0 && sampler[samplerIndex]) {
      database[m.chat].sampler = sampler[samplerIndex];
      caption += `✅ *Sampler berhasil diatur*\n- Sampler: ${sampler[samplerIndex]}\n`;
    } else if (samplerIndex >= 0 && sampler.length >= 0) {
      caption += `❌ *Sampler tidak valid!*\nBerikut daftar sampler yang tersedia:\n${sampler.map((item, index) => `*${index + 1}.* ${item}`).join("\n")}`;
    }
    if (caption) m.reply(caption);
    const modelToUse = database[m.chat].model || _.sample(model);
    const styleToUse = database[m.chat].style || _.sample(style);
    const samplerToUse = database[m.chat].sampler || _.sample(sampler);
    const mime = (q.msg || q).mimetype || "";
    if (!mime) return m.reply("Tidak ada media yang ditemukan");
    const media = await q.download();
    const link = await (/image\/(png|jpe?g|gif)|video\/mp4/.test(mime) ? uploadImage : uploadFile)(media);
    const generateImageParams = {
      imageUrls: [link],
      prompt: "img " + encodeURIComponent(prompt),
      style_preset: styleToUse,
      cfg_scale: 9.5,
      steps: 50,
      seed: _.random(1, 1e4),
      upscale: true,
      width: 768,
      height: 1024
    };
    if (!prompt || !modelToUse || !styleToUse || !samplerToUse) {
      return m.reply(infoMsg);
    }
    m.react(wait);
    const result = await generateImage(generateImageParams, _.sample([...prodiaKey]));
    if (result) {
      await conn.sendMessage(m.chat, {
        image: {
          url: result?.imageUrl || thumb
        },
        caption: `✨ *Gambar berhasil dibuat!*\n- *Model:* ${modelToUse.replace(/[_-]/g, " ").replace(/\..*/, "")}\n- *Style:* ${styleToUse}\n- *Sampler:* ${samplerToUse}\n- *Request oleh:* @${m.sender.split("@")[0]}\n- *Prompt:* ${prompt}`,
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
handler.help = ["photomaker *[query]* --option"];
handler.tags = ["ai"];
handler.command = /^(photomaker)$/i;
export default handler;
async function photomaker(params) {
  try {
    const url = "https://api.prodia.com/v1/sd/photomaker";
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
    const generate = await tryModule(photomaker, photomaker)(params);
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
    const response = await fetch("https://docs.prodia.com/reference/photomaker");
    const html = await response.text();
    const jsonRegex = /{&quot;[^{}]*}/g;
    const allJSON = _.map(_.filter(html.match(jsonRegex), match => match.includes("&quot;")), match => JSON.parse(match.replace(/&quot;/g, '"'))) || [];
    const data = _.filter(allJSON, obj => _.has(obj, "enum"));
    return {
      model: [...new Set([...data[0]?.["enum"], ...await tryModule(prodiaClient.getModels, prodiaClient.getModels) || []])],
      style: data[10]?.["enum"],
      sampler: [...new Set([...data[8]?.["enum"], ...await tryModule(prodiaClient.getSamplers, prodiaClient.getSamplers) || []])]
    };
  } catch (error) {
    console.error("Error fetching models:", error);
    return null;
  }
}