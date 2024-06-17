const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, text: text, command: command }) => {
  if (!text) throw "input text";
  try {
    m.react(wait), await conn.sendFile(m.chat, "https://api.yanzbotz.my.id/api/text2img/neima?prompt=" + text, text, "*[ Result ]*\n" + text, m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["neima"], handler.tags = ["internet"], handler.command = /^neima$/i;
export default handler;