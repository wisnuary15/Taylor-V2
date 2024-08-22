import fetch from "node-fetch";
import * as cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  const providers = [gpt4on, lalaland, freegpt4, bardaifree, chatgptss, bartai];
  let resultFound = false;
  for (const service of providers) {
    try {
      const res = await service(text);
      if (res) {
        m.reply(res);
        resultFound = true;
        break;
      }
    } catch (e) {
      return null;
      console.log(e);
    }
  }
  if (!resultFound) {
    m.react(eror);
    m.reply("Tidak ada provider yang memberikan hasil.");
  }
};
handler.help = ["chatgpt"];
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(chatgpt)$/i;
export default handler;
async function processChat(baseLink, message) {
  try {
    const html = await (await fetch(baseLink)).text();
    const info = cheerio.load(html)(".wpaicg-chat-shortcode").map((_, el) => Object.fromEntries(Object.entries(el.attribs))).get();
    const formData = new FormData();
    formData.append("_wpnonce", info[0]["data-nonce"]);
    formData.append("post_id", info[0]["data-post-id"]);
    formData.append("action", "wpaicg_chatbox_message");
    formData.append("message", message);
    const response = await fetch(baseLink + "/wp-admin/admin-ajax.php", {
      method: "POST",
      body: formData
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const {
      data
    } = await response.json();
    return data || "";
  } catch (error) {
    console.error("An error occurred:", error.message);
    throw error;
  }
}
const chatgptss = async message => await processChat("https://chatgptss.org", message);
const bardaifree = async message => await processChat("https://bardaifree.com", message);
const bartai = async message => await processChat("https://bartai.org", message);
async function freegpt4(prompt) {
  try {
    const response = await fetch(`https://api.freegpt4.ddns.net/?text=${encodeURIComponent(prompt)}`);
    return await response.text();
  } catch (error) {
    throw new Error("Error fetching data from AI service.");
  }
}
async function gpt4on(prompt) {
  try {
    const response = await fetch(`https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(prompt)}&model=gpt-4-32k-0314`);
    return (await response.json())?.response;
  } catch (error) {
    throw new Error("Error fetching data from AI service.");
  }
}
async function lalaland(content) {
  try {
    const response = await fetch("https://lalaland.chat/api/companion/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "unknown",
        messages: [{
          role: "user",
          content: content
        }]
      })
    });
    const data = await response.text();
    const singleSentence = data.split("\n").map(line => line.slice(3, -1)).join("");
    return singleSentence;
  } catch (error) {
    throw new Error("Error fetching data from AI service.");
  }
}