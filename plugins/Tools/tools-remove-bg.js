import fetch from "node-fetch";
import { RemoveBackground, RemoveBackgroundV2 } from "../../lib/tools/remove-background.js";
const handler = async (m, { conn: conn, args: args }) => {
  let q = m.quoted ? m.quoted : m,
    mime = (q.msg || q).mimetype || "";
  if (!/image/.test(mime)) throw "Reply dengan gambar yang ingin dihapus latar belakangnya.";
  m.reply("Mohon tunggu sebentar...");
  try {
    let buffer, media = await (q?.download()),
      sauce = await RemoveBackground(media) || await RemoveBackgroundV2(media);
    if (Buffer.isBuffer(sauce)) buffer = sauce;
    else {
      const response = await fetch(sauce);
      buffer = await response.arrayBuffer();
    }
    await conn.sendFile(m.chat, buffer, "", "", m);
  } catch (error) {
    console.error(error), m.reply("Terjadi kesalahan saat memproses gambar.");
  }
};
handler.help = ["remobg"], handler.tags = ["tools"], handler.command = ["remobg"];
export default handler;