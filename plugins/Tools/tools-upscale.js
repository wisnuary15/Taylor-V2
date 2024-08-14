import fetch from "node-fetch";
import {
  FormData,
  Blob
} from "formdata-node";
import {
  fileTypeFromBuffer
} from "file-type";
import uploadImage from "../../lib/uploadImage.js";
const handler = async (m, {
  command
}) => {
  try {
    let q = m.quoted ? m.quoted : m;
    if (!((q.msg || q).mimetype || "")) return m.reply("Tidak ada media yang ditemukan");
    let media = await q?.download();
    let result, tag = `@${m.sender.split("@")[0]}`;
    switch (command) {
      case "upscale":
        result = await Upscale(media);
        result = result ? Buffer.from(result, "base64") : null;
        break;
      case "upscalev2":
        const mediaURLV2 = await uploadImage(media);
        result = (await UpscaleV2(mediaURLV2))?.result_url;
        break;
      case "upscalev3":
        const mediaURLV3 = await uploadImage(media);
        result = (await UpscaleV3(mediaURLV3))?.data?.imageUrl;
        break;
      case "upscalev4":
        result = await UpscaleV4(media);
        break;
      default:
        throw "Perintah tidak dikenal.";
    }
    if (!result) throw "Terjadi kesalahan saat mengonversi gambar ke HD.";
    return await conn.sendMessage(m.chat, {
      image: {
        url: result
      },
      caption: `Nih effect *${command}* nya\nRequest by: ${tag}`,
      mentions: [m.sender]
    }, {
      quoted: m
    });
  } catch (error) {
    console.error("Error:", error);
    return m.reply("Terjadi kesalahan.");
  }
};
handler.help = ["upscale"].map(v => v + " (Balas foto)");
handler.tags = ["tools"];
handler.command = /^(upscale|upscalev2|upscalev3|upscalev4)$/i;
handler.limit = !0;
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
async function UpscaleV4(imageBuffer) {
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
    data.append("scale", "4");
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