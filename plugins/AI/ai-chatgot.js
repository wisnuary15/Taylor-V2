import fetch from "node-fetch";
async function Chatgot(content) {
  try {
    const url = "https://api.chatgot.io/api/chat/conver";
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWJkbWFsaWthbHFhZHJpMjAwMUBnbWFpbC5jb20iLCJ1aWQiOiI2NjBiZDVlMDFkYTYzY2IyODE5ZmNhNDIiLCJ2ZXJzaW9uIjowfSwiZXhwaXJlIjoxNzMyOTUzNTkxMDExLCJpYXQiOjE3MjUxNzc1OTEsImV4cCI6MTczMjk1MzU5MX0.PnZ3xM3Ys8QRJkOSsnm2WQRp6hf5s3hx3ot8UPA-8hM",
      "i-version": "1.0.0",
      "i-lang": "en",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
      Referer: "https://start.chatgot.io/bot"
    };
    const body = JSON.stringify({
      model: {
        id: "openai/gpt-3.5",
        name: "openai/gpt-3.5-turbo-0125",
        title: "GPT-3.5",
        icon: "/assets/imgs/icon/3.5.jpg",
        extra: {
          title: "Fast",
          bgColor: "#000"
        },
        order: 0,
        isActived: true
      },
      messages: [{
        role: "user",
        content: content
      }],
      networkModelId: "",
      type: "text",
      timezone: "Asia/Makassar"
    });
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
      compress: true
    });
    const data = await response.text();
    return data.split("\n").filter(line => line.trim()).filter(line => line.startsWith("data:")).map(line => JSON.parse(line.slice(5).trim()).choices[0].delta.content).filter(content => content !== undefined).join("");
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
  if (!db.data.dbai.chatgot) db.data.dbai.chatgot = {};
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!inputText) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const answer = await Chatgot(inputText);
    const {
      key: {
        id: keyId
      }
    } = await conn.reply(m.chat, `${answer}`, m);
    db.data.dbai.chatgot[m.sender] = {
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
  if (!db.data.dbai.chatgot || m.isBaileys || !(m.sender in db.data.dbai.chatgot)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.chatgot[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const answer = await Chatgot(m.text.trim());
      const {
        key: {
          id: newKeyId
        }
      } = await conn.reply(m.chat, `${answer}`, m);
      db.data.dbai.chatgot[m.sender].key.id = newKeyId;
      m.react(sukses);
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["chatgot"];
handler.tags = ["ai"];
handler.command = /^(chatgot)$/i;
export default handler;