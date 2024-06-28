import fetch from "node-fetch";
import uploadImage from "../../lib/uploadImage.js";
import uploadFile from "../../lib/uploadFile.js";
const handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender,
    q = (conn.getName(who), m.quoted ? m.quoted : m);
  if (!((q.msg || q).mimetype || "")) throw "Kirim/Reply Gambar Dengan Caption .toanime";
  m.react(wait);
  try {
    let media = await q?.download(),
      hasil = `https://api.xyroinee.xyz/api/others/toanime?url=${await uploadFile(media)}&apikey=${xyro}`;
    await conn.sendFile(m.chat, await (await fetch(hasil)).arrayBuffer(), "error.jpg", "Nih Kak, Maaf Kalau Hasilnya Tidak Sesuai Keinginan", m);
  } catch (e) {
    console.error(e), m.react(eror);
  }
};
handler.help = ["toanimex"], handler.tags = ["ai"], handler.command = /^(jadianimex|toanimex)$/i,
  handler.limit = !0;
export default handler;