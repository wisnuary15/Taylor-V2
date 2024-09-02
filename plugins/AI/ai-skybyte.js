import fetch from "node-fetch";
async function SkyByte(content) {
  try {
    const response = await fetch("https://chat1.ahk1.skybyte.me/chat-process", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        Referer: "https://chat1.ahk1.skybyte.me/#/chat/1002"
      },
      body: JSON.stringify({
        prompt: content,
        options: {},
        systemMessage: "Saya AI dari OpenAI, diciptakan untuk membantu Anda mengeksplorasi ide, bertukar informasi, dan menyelesaikan masalah. Ada yang bisa saya bantu?",
        temperature: .8,
        top_p: 1
      })
    });
    const lines = (await response.text()).split("\n").map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(line => line?.text);
    return lines.length ? lines.at(-1).text : "";
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!db.data.dbai.skybyte) db.data.dbai.skybyte = {};
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!inputText) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const answer = await SkyByte(inputText);
    const {
      key: {
        id: keyId
      }
    } = await conn.reply(m.chat, `${answer}`, m);
    db.data.dbai.skybyte[m.sender] = {
      key: {
        id: keyId
      }
    };
    m.react(sukses);
  } catch (error) {
    console.error("Handler error:", error);
    m.react(eror);
  }
};
handler.before = async (m, {
  conn
}) => {
  if (!db.data.dbai.skybyte || m.isBaileys || !(m.sender in db.data.dbai.skybyte)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.skybyte[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const answer = await SkyByte(m.text.trim());
      const {
        key: {
          id: newKeyId
        }
      } = await conn.reply(m.chat, `${answer}`, m);
      db.data.dbai.skybyte[m.sender].key.id = newKeyId;
      m.react(sukses);
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["skybyte"];
handler.tags = ["ai"];
handler.command = /^(skybyte)$/i;
export default handler;