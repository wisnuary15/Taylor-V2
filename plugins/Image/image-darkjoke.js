import fetch from "node-fetch";
import bo from "dhn-api";
const handler = async (m, {
  conn,
  usedPrefix,
  text,
  args,
  command
}) => {
  try {
    const joke = await bo.Darkjokes(),
      message = `*[ DARKJOKE ]*\nPermintaan oleh:\n${m.name}`;
    await conn.sendFile(m.chat, joke, "", message, m);
  } catch (err) {
    console.error(err), await conn.reply(m.chat, "Terjadi kesalahan saat mengambil joke. Silakan coba lagi nanti.", m);
  }
};
handler.help = ["darkjoke"], handler.tags = ["fun"], handler.command = /^(darkjoke)$/i;
export default handler;