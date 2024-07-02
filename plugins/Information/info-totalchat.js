const handler = async (m, {
  conn
}) => {
  const messages = conn.chats[m.chat].messages,
    participantCounts = {};
  Object.values(messages).forEach(({
    key
  }) => participantCounts[key.participant] = (participantCounts[key.participant] || 0) + 1);
  const sortedData = Object.entries(participantCounts).sort((a, b) => b[1] - a[1]),
    totalM = sortedData.reduce((acc, [, total]) => acc + total, 0),
    totalPeople = sortedData.length,
    pesan = sortedData.map(([jid, total], index) => `*${index + 1}.* ${jid.replace(/(\d+)@.+/, "@$1")}: *${total}* pesan`).join("\n");
  m.reply(`📊 *Total Pesan Terakhir*: *${totalM}* pesan dari *${totalPeople}* orang\n\n${pesan}`, null, {
    contextInfo: {
      mentionedJid: sortedData.map(([jid]) => jid)
    }
  });
};
handler.help = ["totalpesan"], handler.tags = ["group"], handler.command = /^(totalpesan)$/i,
  handler.group = !0;
export default handler;
