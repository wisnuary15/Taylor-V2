import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    const res = await ChatGpt(text);
    m.reply(res);
  } catch (e) {
    try {
      const res = await bardaifree(text);
      m.reply(res);
    } catch (e) {
      try {
        const res = await chatgptss(text);
        m.reply(res);
      } catch (e) {
        try {
          const res = await bartai(text);
          m.reply(res);
        } catch (e) {
          m.react(eror);
        }
      }
    }
  }
};
handler.help = ["chatgpt"], handler.tags = ["internet", "ai", "gpt"], handler.command = /^(chatgpt)$/i;
export default handler;
async function processChat(baseLink, message) {
  try {
    const html = await (await fetch(baseLink)).text(),
      info = cheerio.load(html)(".wpaicg-chat-shortcode").map((index, element) => Object.fromEntries(Object.entries(element.attribs))).get(),
      formData = new FormData();
    formData.append("_wpnonce", info[0]["data-nonce"]), formData.append("post_id", info[0]["data-post-id"]),
      formData.append("action", "wpaicg_chatbox_message"), formData.append("message", message);
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
    throw console.error("An error occurred:", error.message), error;
  }
}
async function chatgptss(message) {
  try {
    return await processChat("https://chatgptss.org", message);
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}
async function bardaifree(message) {
  try {
    return await processChat("https://bardaifree.com", message);
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}
async function bartai(message) {
  try {
    return await processChat("https://bartai.org", message);
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}
async function ChatGpt(prompt) {
  try {
    const response = await fetch(`https://api.freegpt4.ddns.net/?text=${prompt}`);
    return await response.text();
  } catch (error) {
    throw new Error("Error fetching data from AI service.");
  }
}
