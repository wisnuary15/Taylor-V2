import fetch from 'node-fetch';
const handler = async (m, { conn, usedPrefix }) => {
  let chats = Object.entries(db.data.chats).filter(([jid, chat]) => chat.isBanned && jid.endsWith('@g.us'));
  let users = Object.entries(db.data.users).filter(([jid, user]) => user.banned && jid.endsWith('@s.whatsapp.net'));
  const getChatNames = Promise.all(chats.map(async ([jid], i) => {
    let name = await conn.getName(jid);
    return `
│ ${i + 1}). ${name === undefined ? 'Unknown' : name}
`.trim();
  }));
  const getUserNames = Promise.all(users.map(async ([jid], i) => {
    let name = await conn.getName(jid);
    return `
│ ${i + 1}). ${name === undefined ? 'Unknown' : name}
`.trim();
  }));
  const [chatNames, userNames] = await Promise.all([getChatNames, getUserNames]);
  const message = `
${cmenut} *Daftar Chat Terbanned*
│ Total : ${chats.length} Chat${chats.length > 0 ? '\n' + chatNames.join('\n') : ''}
${cmenuf}

${cmenut} *Daftar User Terbanned*
│ Total : ${users.length} User${users.length > 0 ? '\n' + userNames.join('\n') : ''}
${cmenuf}
`.trim();
  conn.reply(m.chat, message, m, {
    contextInfo: {
      externalAdReply: {
        title: botdate,
        body: bottime,
        mediaType: 2,
        sourceUrl: sig,
        mediaUrl: sig,
        thumbnail: await (await fetch('https://telegra.ph/file/1836eec6c22d949829474.jpg')).arrayBuffer()
      }
    }
  });
};
handler.help = ['bannedlist'];
handler.tags = ['info'];
handler.command = /^listban(ned)?|ban(ned)?list|daftarban(ned)?$/i;
export default handler;
