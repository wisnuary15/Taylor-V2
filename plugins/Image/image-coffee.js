const handler = async (m, { conn: conn, isOwner: isOwner, usedPrefix: usedPrefix, command: command, args: args }) => {
  try {
    m.react(wait);
    let cofe = "https://coffee.alexflipnote.dev/random";
    await conn.sendFile(m.chat, cofe, "", "*[ Random Coffee ]*", m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["coffee"], handler.tags = ["search"], handler.command = /^(coffee)$/i;
export default handler;