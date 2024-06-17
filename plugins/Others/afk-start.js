const handler = async (m, { conn: conn, text: text, usedPrefix: usedPrefix, command: command }) => {
  conn.listAfk = conn.listAfk || {};
  try {
    let user = db.data.users[m.sender];
    user.afk = +new Date, user.afkReason = text;
    const username = m.name || m.pushName,
      id = m.sender || m.key.remoteJid;
    conn.listAfk[m.chat] = conn.listAfk[m.chat] ? conn.listAfk[m.chat].some((user => user.id === id)) ? conn.listAfk[m.chat] : [...conn.listAfk[m.chat], {
      username: username,
      id: id
    }] : [{
      username: username,
      id: id
    }];
    const caption = `\n🚀 ${conn.getName(m.sender)} @${m.sender.split("@")[0]} Sekarang lagi AFK\n*Dengan Alasan:*\n${text ? " " + text : "Tanpa alasan"}`;
    await conn.reply(m.chat, caption, m, {
      contextInfo: {
        mentionedJid: conn.parseMention(caption),
        externalAdReply: {
          title: "AFK Start",
          thumbnail: await (await conn.getFile("https://cdn-icons-png.flaticon.com/128/742/742927.png")).data
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};
handler.help = ["afk [alasan]"], handler.tags = ["main"], handler.group = !0,
  handler.command = /^afk$/i;
export default handler;