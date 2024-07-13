import {
  Svgai,
  Arthub,
  Limewire
} from "../../lib/tools/ai-gen.js";
import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    let data;
    switch (command) {
      case "svgai":
        data = await Svgai(text);
        break;
      case "arthub":
        data = await Arthub(text);
        break;
      case "limewire":
        data = await Limewire(text);
        break;
      case "txt2img3":
        await conn.sendFile(m.chat, `https://api.fumifumi.xyz/api/text2img?query=${encodeURIComponent(text)}`, "", `Image for ${text}`, m, false, {
          mentions: [m.sender]
        });
        return;
      case "txt2img4":
        await conn.sendFile(m.chat, `https://s5nkoou91a.execute-api.us-east-1.amazonaws.com/Prod/image?prompt=${encodeURIComponent(text)}`, "", `Image for ${text}`, m, false, {
          mentions: [m.sender]
        });
        return;
      case "txt2img5":
        await conn.sendMessage(m.chat, {
          image: {
            url: (await stabilityai(text))[0]?.url
          },
          caption: `Image for ${text}`
        }, {
          quoted: m
        });
        return;
      default:
        return;
    }
    if (data) {
      const imageUrl = command === "svgai" ? data.data[0]?.generated_png_s3_url || data.data[0]?.png_s3_url : command === "arthub" ? data.generations[0]?.img : command === "limewire" ? data.data[0]?.asset_url : null;
      if (imageUrl) {
        await conn.sendFile(m.chat, imageUrl, "", `Image for ${text}`, m, false, {
          mentions: [m.sender]
        });
      }
    }
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["svgai", "arthub", "limewire", "txt2img3", "txt2img4", "txt2img5"];
handler.tags = ["ai"];
handler.command = /^(svgai|arthub|limewire|txt2img3|txt2img4|txt2img5)$/i;
export default handler;
async function stabilityai(prompt) {
  const enhancements = " realistic, smoothening, epic cinematic lighting, dark villanous looking background.";
  prompt = prompt.replace("{enhanced}", enhancements);
  const BASE_URL = "https://stabilityai-stable-diffusion-3-medium.hf.space/";
  const session_hash = Math.random().toString(36).substring(2).slice(1);
  try {
    const joinResp = await fetch(`${BASE_URL}queue/join?__theme=light`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [prompt, "", 0, true, 1024, 1024, 5, 28],
        event_data: null,
        fn_index: 1,
        session_hash: session_hash,
        trigger_id: 4
      })
    });
    const joinData = await joinResp.json();
    if (joinData.event_id) {
      const dataResp = await fetch(`${BASE_URL}queue/data?session_hash=${session_hash}`);
      const dataText = await dataResp.text();
      const splited = dataText.split("\n");
      const processStartsLine = splited.find(line => line.includes("process_completed"));
      const processStartsData = processStartsLine ? JSON.parse(processStartsLine.replace("data: ", "")) : null;
      const processStartsLine2 = splited.find(line => line.includes("progress"));
      const processStartsData2 = processStartsLine2 ? JSON.parse(processStartsLine2.replace("data: ", "")) : null;
      return processStartsData?.success ? processStartsData.output.data : processStartsData2?.success ? processStartsData2.output.data : null;
    }
  } catch (e) {
    console.log("error:" + e.message);
    return e.message;
  }
}
