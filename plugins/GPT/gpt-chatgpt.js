import fetch from "node-fetch";
import * as cheerio from "cheerio";
class AIService {
  async processChat(baseLink, message) {
    try {
      const html = await (await fetch(baseLink)).text();
      const info = cheerio.load(html)(".wpaicg-chat-shortcode").map((_, el) => Object.fromEntries(Object.entries(el.attribs))).get();
      const formData = new FormData();
      formData.append("_wpnonce", info[0]["data-nonce"]);
      formData.append("post_id", info[0]["data-post-id"]);
      formData.append("action", "wpaicg_chatbox_message");
      formData.append("message", message);
      const response = await fetch(`${baseLink}/wp-admin/admin-ajax.php`, {
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
  async chatgptss(message) {
    return await this.processChat("https://chatgptss.org", message);
  }
  async bardaifree(message) {
    return await this.processChat("https://bardaifree.com", message);
  }
  async bartai(message) {
    return await this.processChat("https://bartai.org", message);
  }
  async freegpt4(prompt) {
    try {
      const response = await fetch(`https://api.freegpt4.ddns.net/?text=${encodeURIComponent(prompt)}`);
      return await response.text();
    } catch (error) {
      throw new Error("Error fetching data from AI service.");
    }
  }
  async gpt4on(prompt) {
    try {
      const response = await fetch(`https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(prompt)}&model=gpt-4-32k-0314`);
      return (await response.json())?.response;
    } catch (error) {
      throw new Error("Error fetching data from AI service.");
    }
  }
  async lalaland(content) {
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
}
const aiService = new AIService();
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!db.data.dbai.chatgpt) db.data.dbai.chatgpt = {};
  const text = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  const providers = [aiService.gpt4on.bind(aiService), aiService.lalaland.bind(aiService), aiService.freegpt4.bind(aiService), aiService.bardaifree.bind(aiService), aiService.chatgptss.bind(aiService), aiService.bartai.bind(aiService)];
  let resultFound = false;
  for (const service of providers) {
    try {
      const res = await service(text);
      if (res) {
        const {
          key: {
            id: keyId
          }
        } = await conn.reply(m.chat, res, m);
        db.data.dbai.chatgpt[m.sender] = {
          key: {
            id: keyId
          }
        };
        resultFound = true;
        break;
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (!resultFound) {
    m.react(eror);
  } else {
    m.react(sukses);
  }
};
handler.before = async (m, {
  conn
}) => {
  if (!db.data.dbai.chatgpt || m.isBaileys || !(m.sender in db.data.dbai.chatgpt)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.chatgpt[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const inputText = m.text.trim();
      const providers = [aiService.gpt4on.bind(aiService), aiService.lalaland.bind(aiService), aiService.freegpt4.bind(aiService), aiService.bardaifree.bind(aiService), aiService.chatgptss.bind(aiService), aiService.bartai.bind(aiService)];
      let resultFound = false;
      for (const service of providers) {
        try {
          const res = await service(inputText);
          if (res) {
            const {
              key: {
                id: newKeyId
              }
            } = await conn.reply(m.chat, res, m);
            db.data.dbai.chatgpt[m.sender].key.id = newKeyId;
            resultFound = true;
            break;
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (!resultFound) {
        m.react(eror);
      } else {
        m.react(sukses);
      }
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["chatgpt"];
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(chatgpt)$/i;
export default handler;