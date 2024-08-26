import fetch from "node-fetch";
import crypto from "crypto";
const CodeBuddy = async (prompt, system) => {
  const availableSystems = ["cleo", "ai", "ferdie"];
  if (!prompt) return "Input prompt tidak ada";
  if (!system || !availableSystems.includes(system)) return availableSystems;
  try {
    const response = await fetch(`https://codebuddy-server.onrender.com/${system}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        user: "You"
      })
    });
    return (await response.json()).msg;
  } catch (error) {
    console.error("CodeBuddy fetch error:", error);
    return "Terjadi kesalahan saat memproses permintaan.";
  }
};
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  args
}) => {
  if (!db.data.dbai.codebuddy) db.data.dbai.codebuddy = {};
  const session = db.data.dbai.codebuddy[m.sender];
  const query = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!query) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const modelName = ["cleo", "ai", "ferdie"];
    const model = modelName[Math.floor(Math.random() * modelName.length)];
    const response = await CodeBuddy(query, model);
    if (response) {
      const {
        key: {
          id: keyId
        }
      } = await conn.sendMessage(m.chat, {
        text: response
      }, {
        quoted: m
      });
      db.data.dbai.codebuddy[m.sender] = {
        key: {
          id: keyId
        }
      };
      m.react(sukses);
    } else {
      console.log("Tidak ada respons dari CodeBuddy atau terjadi kesalahan.");
      m.react(eror);
    }
  } catch (error) {
    console.error("Handler error:", error);
    m.react(eror);
  }
};
handler.before = async (m, {
  conn
}) => {
  if (!db.data.dbai.codebuddy || m.isBaileys || !(m.sender in db.data.dbai.codebuddy)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.codebuddy[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const modelName = ["cleo", "ai", "ferdie"];
      const model = modelName[Math.floor(Math.random() * modelName.length)];
      const response = await CodeBuddy(m.text.trim(), model);
      if (response) {
        const {
          key: {
            id: newKeyId
          }
        } = await conn.sendMessage(m.chat, {
          text: response
        }, {
          quoted: m
        });
        db.data.dbai.codebuddy[m.sender].key.id = newKeyId;
        m.react(sukses);
      } else {
        console.log("Tidak ada respons dari CodeBuddy atau terjadi kesalahan.");
        m.react(eror);
      }
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["codebuddy *[query]*"];
handler.tags = ["ai"];
handler.command = /^(codebuddy)$/i;
export default handler;