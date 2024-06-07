const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (conn.user.jid === conn.user.jid) conn.reply(m.chat, 'Kamu tidak jadi bot!?', m)
  else {
    conn.reply(m.chat, 'Goodbye bot :\')', m)
    conn.close()
  }
}
handler.help = ['scanbotstop']
handler.tags = ['jadibot']
handler.command = /^(scanbotstop)$/i
export default handler
