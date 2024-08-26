import {
  Blackbox
} from "../../lib/ai/blackbox.js";
const blackbox = new Blackbox();
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!db.data.dbai.blackboxchat) db.data.dbai.blackboxchat = {};
  const session = db.data.dbai.blackboxchat[m.sender];
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!inputText) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const input = [{
      role: "user",
      content: inputText
    }];
    const data = await blackbox.chat(input, "Realtime", true, false, false, false);
    const answer = data?.replace(/\$@\$v=v1\.13\$@\$(.*?)\]/g, "").trim();
    if (answer) {
      const {
        key: {
          id: keyId
        }
      } = await conn.reply(m.chat, answer, m);
      db.data.dbai.blackboxchat[m.sender] = {
        key: {
          id: keyId
        }
      };
      m.react(sukses);
    } else {
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
  if (!db.data.dbai.blackboxchat || m.isBaileys || !(m.sender in db.data.dbai.blackboxchat)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.blackboxchat[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const input = [{
        role: "user",
        content: m.text.trim()
      }];
      const data = await blackbox.chat(input, "Realtime", true, false, false, false);
      const answer = data?.replace(/\$@\$v=v1\.13\$@\$(.*?)\]/g, "").trim();
      if (answer) {
        const {
          key: {
            id: newKeyId
          }
        } = await conn.reply(m.chat, answer, m);
        db.data.dbai.blackboxchat[m.sender].key.id = newKeyId;
        m.react(sukses);
      } else {
        m.react(eror);
      }
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["blackboxchat"];
handler.tags = ["owner"];
handler.command = /^(blackboxchat)$/i;
export default handler;