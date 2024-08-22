import fetch from "node-fetch";
import sizeOf from "image-size";
import {
  FormData,
  Blob
} from "formdata-node";
import {
  fileTypeFromBuffer
} from "file-type";
import uploadImage from "../../lib/uploadImage.js";
const availableScales = [2, 4, 6, 8, 16];
const handler = async (m, {
  command,
  text
}) => {
  try {
    let q = m.quoted ? m.quoted : m;
    if (!((q.msg || q).mimetype || "")) {
      return m.reply("⚠️ Tidak ada media yang ditemukan.");
    }
    let media = await q.download();
    let scale = availableScales.includes(parseInt(text)) ? parseInt(text) : 2;
    let result, versionInfo, tag = `@${m.sender.split("@")[0]}`;
    switch (command) {
      case "upscale":
        result = await Upscale(media);
        result = result ? Buffer.from(result, "base64") : null;
        versionInfo = `✨ *Versi*: v1\n🔍 *Skala*: ${scale}`;
        break;
      case "upscalev2":
        const mediaURLV2 = await uploadImage(media);
        result = (await UpscaleV2(mediaURLV2))?.result_url;
        versionInfo = `✨ *Versi*: v2\n🔍 *Skala*: ${scale}`;
        break;
      case "upscalev3":
        const mediaURLV3 = await uploadImage(media);
        result = (await UpscaleV3(mediaURLV3))?.data?.imageUrl;
        versionInfo = `✨ *Versi*: v3\n🔍 *Skala*: ${scale}`;
        break;
      case "upscalev4":
        result = await UpscaleV4(media, scale);
        versionInfo = `✨ *Versi*: v4\n🔍 *Skala*: ${scale}`;
        break;
      case "upscalev5":
        result = await UpscaleV5(media, scale);
        versionInfo = `✨ *Versi*: v5\n🔍 *Skala*: ${scale}`;
        break;
      default:
        return m.reply(`⚠️ Perintah tidak dikenal.\n\nSkala yang tersedia: ${availableScales.toString()}`);
    }
    if (!result) {
      return m.reply("⚠️ Terjadi kesalahan saat mengonversi gambar ke HD.");
    }
    return await conn.sendMessage(m.chat, {
      image: {
        url: result
      },
      caption: `🌟 *Effect*: ${command}\n📩 *Request by*: ${tag}\n${versionInfo}\n📏 *Skala yang bisa digunakan*: ${availableScales.toString()}`,
      mentions: [m.sender]
    }, {
      quoted: m
    });
  } catch (error) {
    console.error("Error:", error);
    return m.reply("⚠️ Terjadi kesalahan.");
  }
};
handler.help = ["upscale", "upscalev2", "upscalev3", "upscalev4", "upscalev5"].map(v => v + " (Balas foto) [skala]");
handler.tags = ["tools"];
handler.command = /^(upscale|upscalev2|upscalev3|upscalev4|upscalev5)$/i;
handler.limit = true;
export default handler;
async function Upscale(imageBuffer) {
  try {
    const response = await fetch("https://lexica.qewertyy.dev/upscale", {
      body: JSON.stringify({
        image_data: Buffer.from(imageBuffer, "base64"),
        format: "binary"
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}
async function UpscaleV2(mediaURL) {
  try {
    const response = await fetch(`https://vex-kshitiz.vercel.app/upscale?url=${encodeURIComponent(mediaURL)}`);
    return await response.json();
  } catch {
    return null;
  }
}
async function UpscaleV3(mediaURL) {
  try {
    const response = await fetch(`https://nue-api.koyeb.app/upscale?url=${encodeURIComponent(mediaURL)}&key=ins08st0`);
    return await response.json();
  } catch {
    return null;
  }
}
async function UpscaleV4(imageBuffer, scale) {
  try {
    const {
      ext,
      mime
    } = await fileTypeFromBuffer(imageBuffer) || {
      ext: "jpg",
      mime: "image/jpeg"
    };
    const blob = new Blob([imageBuffer], {
      type: mime
    });
    const data = new FormData();
    data.append("image", blob, `image.${ext}`);
    data.append("scale", String(scale));
    const response = await fetch("https://api2.pixelcut.app/image/upscale/v1", {
      method: "POST",
      body: data,
      headers: {
        accept: "application/json",
        "user-agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36${Date.now()}`
      }
    });
    const result = await response.json();
    return result.result_url;
  } catch {
    return null;
  }
}
async function UpscaleV5(buffer, scale) {
  try {
    const apiUrl = "https://api.upscalepics.com/upscale-to-size";
    const fileType = await fileTypeFromBuffer(buffer);
    const mimeType = fileType?.mime || "image/jpeg";
    const dimensions = sizeOf(buffer);
    const formData = new FormData();
    formData.append("image_file", new Blob([buffer], {
      type: mimeType
    }), `image.${fileType?.ext || "jpg"}`);
    formData.append("desiredHeight", dimensions.height * scale);
    formData.append("desiredWidth", dimensions.width * scale);
    formData.append("outputFormat", "png");
    formData.append("compressionLevel", "None");
    formData.append("anime", "False");
    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData
    });
    const json = await res.json();
    return json.image_url;
  } catch {
    return null;
  }
}