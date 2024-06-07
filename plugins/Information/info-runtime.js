const handler = async (m, {
  conn
}) => {
  try {
    let who = m.mentionedJid && m.mentionedJid[0] || (m.fromMe ? conn.user.jid : m.sender);
    let startTime = await new Promise(resolve => setTimeout(resolve, 0)) || process.uptime() * 1000;
    let muptime = clockString(startTime);
    let message = `*⏳ Runtime Overview ⏳*\n────────────────────\n${muptime}\n────────────────────`;
    const thumbnail = await conn.getFile("https://cdn-icons-png.flaticon.com/128/10984/10984804.png");
    await conn.sendMessage(m.chat, {
      text: message,
      contextInfo: {
        externalAdReply: {
          title: "🤖 Bot Runtime",
          thumbnail: thumbnail.data,
        },
        mentionedJid: [who],
      },
    }, {
      quoted: m
    });
  } catch (error) {
    console.error(error);
  }
}
handler.help = ['runtime'];
handler.tags = ['info'];
handler.command = /^r(untime?|t)$/i;
export default handler;

function clockString(ms) {
  try {
    let [d, h, m, s] = isNaN(ms) ? ['--', '--', '--', '--'] : [Math.floor(ms / 86400000), Math.floor(ms / 3600000) % 24,
      Math.floor(ms / 60000) % 60, Math.floor(ms / 1000) % 60
    ];
    return `☀️ *${d}* Days\n🕐 *${h}* Hours\n⏰ *${m}* Minutes\n⏱️ *${s}* Seconds`;
  } catch (error) {
    console.error(error);
    return 'Error in clockString function';
  }
}
