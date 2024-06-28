const handler = async (m, {
  conn
}) => {
  try {
    const groupId = m.chat,
      listbot = [{
        number: conn.user.jid,
        name: conn.user.name,
        groupId: groupId
      }, ...conn.user.listbot[groupId] || []].filter(bot => bot.groupId === groupId),
      totalBots = listbot.length,
      formattedText = listbot.map(({
        number,
        name
      }, index) => `*${index + 1}.* @${number.split("@")[0]} - ${name}`).join("\n");
    m.reply(`📊 *Total Bot*: *${totalBots}* pesan dari *${totalBots}* bot\n\n${formattedText}`, null, {
      contextInfo: {
        mentionedJid: listbot.map(({
          number
        }) => number)
      }
    });
  } catch (e) {
    console.error(e), await conn.reply(m.chat, "Terjadi kesalahan.", m);
  }
};
handler.help = ["listbot"], handler.tags = ["listbot"], handler.command = /^(listbot|bots)$/i,
  handler.group = !0;
export default handler;