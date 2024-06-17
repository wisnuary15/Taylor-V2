const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender,
    url = await conn.profilePictureUrl(who).catch((_ => "./src/avatar_contact.png")),
    scircle = API("dzx", "/api/canvas/circle", {
      url: url
    });
  await conn.sendFile(m.chat, scircle, "pp.jpg", "*Done!*", m);
};
handler.help = ["circle"].map((v => v + " <tag>")), handler.tags = ["maker"],
  handler.command = /^(cir(cle)?(le)?(cele)?(kel)?)$/i;
export default handler;