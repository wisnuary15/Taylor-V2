import { fetch } from "undici";
import { Gemini } from "../../lib/ai/gemini.js";
export async function before(m) {
  try {
    if (m.isBaileys && m.fromMe) return !0;
    if (!m.isGroup || !m.msg || !m.message || m.key.remoteJid !== m.chat || db.data.users[m.sender].banned || db.data.chats[m.chat].isBanned) return !1;
    new Gemini("__Secure-1PSID", "g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076");
    const { users: users, chats: chats } = db.data, { text: text, quoted: quoted } = m;
    if ("protocolMessage" === m.mtype || "pollUpdateMessage" === m.mtype || "reactionMessage" === m.mtype || "stickerMessage" === m.mtype) return;
    if (!quoted || !quoted.isBaileys || !chats[m.chat].gemini) return !0;
    const msg = encodeURIComponent(text),
      candidates = await GoogleBard(msg);
    if (candidates) candidates && m.reply(candidates);
    else {
      const { result: result } = await AemtGemini(msg);
      result && m.reply(result);
    }
  } catch (error) {
    console.error(error);
  }
}
async function AemtGemini(query) {
  const bardRes = await fetch(`https://aemt.me/gemini?text=${query}`, {
    method: "get",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
  return await bardRes.json();
}
async function GoogleBard(query) {
  try {
    return (await gemini.question(query)).content;
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}