import fetch from "node-fetch";
import crypto from "crypto";
const AiContinues = async (inputText, uid) => {
  const params = new URLSearchParams({
    q: inputText,
    uid: uid,
    model: "gpt-4",
    cai: ""
  });
  try {
    const res = await fetch(`https://ai-continues.onrender.com/chatbox?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return (await res.json()).answer;
  } catch (error) {
    console.error("AI response fetch failed:", error);
    throw new Error("AI response fetch failed.");
  }
};
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!conn.chatboxai) conn.chatboxai = {};
  const session = conn.chatboxai[m.sender];
  const uid = session ? session.uid : crypto.randomBytes(16).toString("hex");
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!inputText) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const answer = await AiContinues(inputText, uid);
    const {
      key: {
        id: keyId
      }
    } = await conn.reply(m.chat, `${answer}`, m);
    conn.chatboxai[m.sender] = {
      uid: uid,
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
  if (!conn.chatboxai || m.isBaileys || !(m.sender in conn.chatboxai)) return;
  const {
    key: {
      id: keyId
    },
    uid
  } = conn.chatboxai[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const answer = await AiContinues(m.text.trim(), uid);
      const {
        key: {
          id: newKeyId
        }
      } = await conn.reply(m.chat, `${answer}`, m);
      conn.chatboxai[m.sender].key.id = newKeyId;
      m.react(sukses);
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["chatboxai"];
handler.tags = ["owner"];
handler.command = /^(chatboxai)$/i;
export default handler;