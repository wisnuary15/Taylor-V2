import axios from "axios";
import uploadImage from "../../lib/uploadImage.js";
import {
  tools
} from "../../lib/scraper/all/tools.js";
const handler = async (m, {
  text,
  usedPrefix,
  command,
  conn
}) => {
  const versions = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];
  const [input, version] = text.split(" ");
  const linkRegex = /^(https?:\/\/[^\s]+)/;
  if (!input || !linkRegex.test(input)) {
    return m.reply(`📎 *\`Masukkan tautan yang valid:\`*\n\n*Contoh Penggunaan:*\n${usedPrefix + command} https://google.com v2`);
  }
  if (!version) {
    const buttons = conn.ctaButton.setBody(`📋 *\`Screenshot target:\`*\n- ${input}\n*Pilih versi screenshot dari daftar berikut:*`).addSelection("🔍 Pilih versi").makeSections("🔢 Daftar Versi", "Pilih salah satu versi");
    versions.forEach((v, i) => {
      buttons.makeRow("", `Versi ${i + 1}`, "Pilih: " + v.toUpperCase(), `${usedPrefix}${command} ${input} ${v}`);
    });
    return buttons.run(m.chat, conn, m);
  }
  if (!versions.includes(version.toLowerCase())) {
    return m.reply(`❌ *\`Versi tidak valid:\`*\n\n*Contoh:* \n${usedPrefix + command} https://example.com v2\n\n*Pilih versi yang ada:* \n(v1 of v${versions.length})`);
  }
  try {
    m.react(wait);
    let res = await getScreenshot(input, version);
    if (!Buffer.isBuffer(res) && typeof res === "string" && /^https?:\/\//.test(res)) {
      res = await getBuffer(res);
    }
    const caption = `✨ *\`Screenshot sukses!\`*\n- ${input}\n\n*\`Request:\`*\n- @${m.sender.split("@")[0]}`;
    await conn.sendMessage(m.chat, {
      image: res,
      caption: caption,
      mentions: [m.sender]
    }, {
      quoted: m
    });
    m.react(sukses);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["ss", "ssf", "ssweb"];
handler.tags = ["tools"];
handler.command = /^ss(web|f)?$/i;
export default handler;
async function getScreenshot(url, version) {
  try {
    let res;
    url = encodeURIComponent(url);
    switch (version.toLowerCase()) {
      case "v1":
        res = `https://webss.yasirweb.eu.org/api/screenshot?resX=1280&resY=900&outFormat=jpg&waitTime=1000&isFullPage=true&dismissModals=false&url=${url}`;
        break;
      case "v2":
        res = `https://api.apiflash.com/v1/urltoimage?access_key=7eea5c14db5041ecb528f68062a7ab5d&wait_until=page_loaded&url=${url}`;
        break;
      case "v3":
        res = `https://image.thum.io/get/fullpage/${url}`;
        break;
      case "v4":
        res = `https://mini.s-shot.ru/2560x1600/PNG/2560/Z100/?${url}`;
        break;
      case "v5":
        res = await ssweb(url, "full", "desktop");
        break;
      case "v6":
        res = await pikwy(url);
        break;
      case "v7":
        res = (await tools.ssweb(url))?.data;
        break;
      case "v8":
        res = `https://2s9e3bif52.execute-api.eu-central-1.amazonaws.com/production/screenshot?url=${url}`;
        break;
      case "v9":
        res = `https://2wg20nrbv4.execute-api.eu-west-1.amazonaws.com/default/screenshot","?url=${url}`;
        break;
      case "v10":
        res = await googleApis(url);
        break;
      default:
        throw new Error("Versi tidak valid");
    }
    return res;
  } catch (e) {
    throw new Error("Gagal mendapatkan screenshot");
  }
}
async function getBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer"
    });
    return Buffer.from(response.data, "binary");
  } catch (e) {
    throw new Error("Gagal mengonversi tautan menjadi buffer");
  }
}
async function ssweb(url = "", full = false, type = "desktop") {
  try {
    const form = new URLSearchParams({
      url: url,
      device: type.toLowerCase(),
      cacheLimit: 0
    });
    full && form.append("full", "on");
    const res = await axios.post("https://www.screenshotmachine.com/capture.php", form);
    const cookies = res.headers["set-cookie"];
    const buffer = await axios.get("https://www.screenshotmachine.com/" + res.data.link, {
      headers: {
        cookie: cookies.join("")
      },
      responseType: "arraybuffer"
    });
    return Buffer.from(buffer.data);
  } catch (e) {
    throw new Error("Gagal mengambil screenshot dari ssweb");
  }
}
async function pikwy(url) {
  try {
    const response = await axios.get(`https://api.pikwy.com/?tkn=125&d=3000&u=${url}&fs=0&w=1920&h=1080&f=png&rt=jweb`);
    return response.data?.iurl;
  } catch (e) {
    throw new Error("Gagal mengonversi tautan menjadi buffer");
  }
}
async function googleApis(url) {
  try {
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${url}`);
    const siteData = response.data;
    const dataURL = siteData.lighthouseResult?.fullPageScreenshot?.screenshot?.data;
    const base64Data = dataURL.replace(/^data:image\/webp;base64,/, "");
    return Buffer.from(base64Data, "base64");
  } catch (e) {
    throw new Error("Gagal mengonversi tautan menjadi buffer");
  }
}