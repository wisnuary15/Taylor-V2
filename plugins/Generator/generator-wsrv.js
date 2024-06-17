import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
import fetch from "node-fetch";
const handler = async (m, { conn: conn, text: text, args: args, usedPrefix: usedPrefix, command: command }) => {
  let q = m.quoted ? m.quoted : m,
    mime = (q.msg || q).mimetype || "";
  if (!mime) throw "No media found";
  let media = await (q?.download()),
    isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime),
    link = await (isTele ? uploadImage : uploadFile)(media);
  if (!text) throw "Input parameter required\n\n*Detail:* https://images.weserv.nl/docs/";
  try {
    const wsrv = "https://wsrv.nl/?url=" + link + "&" + text.replace(/ /g, "&").replace(/(\w+)=(\w+)/g, "$1=$2");
    await conn.sendFile(m.chat, wsrv, "wsrv.jpg", "Sudah Jadi", m);
  } catch (e) {
    m.reply(eror + "\n\n*Detail:* https://images.weserv.nl/docs/");
  }
};
handler.help = ["towsrv"].map((v => v + " (Balas foto)")), handler.tags = ["tools"],
  handler.command = /^(to|jadi)?wsrv$/i, handler.limit = !0;
export default handler;