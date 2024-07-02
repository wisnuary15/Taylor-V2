import fetch from "node-fetch";
const handler = async (m, {
  conn,
  usedPrefix
}) => {
  let chats = Object.entries(db.data.chats).filter(([jid, chat]) => chat.isBanned && jid.endsWith("@g.us")),
    users = Object.entries(db.data.users).filter(([jid, user]) => user.banned && jid.endsWith("@s.whatsapp.net"));
  const getChatNames = Promise.all(chats.map(async ([jid], i) => {
      let name = await conn.getName(jid);
      return `\n│ ${i + 1}). ${void 0 === name ? "Unknown" : name}\n`.trim();
    })),
    getUserNames = Promise.all(users.map(async ([jid], i) => {
      let name = await conn.getName(jid);
      return `\n│ ${i + 1}). ${void 0 === name ? "Unknown" : name}\n`.trim();
    })),
    [chatNames, userNames] = await Promise.all([getChatNames, getUserNames]),
    message = `\n${cmenut} *Daftar Chat Terbanned*\n│ Total : ${chats.length} Chat${chats.length > 0 ? "\n" + chatNames.join("\n") : ""}\n${cmenuf}\n\n${cmenut} *Daftar User Terbanned*\n│ Total : ${users.length} User${users.length > 0 ? "\n" + userNames.join("\n") : ""}\n${cmenuf}\n`.trim();
  await conn.reply(m.chat, message, m, {
    contextInfo: {
      externalAdReply: {
        title: botdate,
        body: bottime,
        mediaType: 2,
        sourceUrl: sig,
        mediaUrl: sig,
        thumbnail: await (await fetch("https://telegra.ph/file/1836eec6c22d949829474.jpg")).arrayBuffer()
      }
    }
  });
};
handler.help = ["bannedlist"], handler.tags = ["info"], handler.command = /^listban(ned)?|ban(ned)?list|daftarban(ned)?$/i;
export default handler;
