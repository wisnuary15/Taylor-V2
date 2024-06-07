const handler = async (m, {
  conn
}) => {
  prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(
    /[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  m.reply(`Prefix berhasil direset`)
  // conn.fakeReply(m.chat, 'Prefix berhasil direset', '0@s.whatsapp.net', 'Reset Prefix')
}
handler.help = ['resetprefix']
handler.tags = ['owner']
handler.command = /^(resetprefix)$/i
handler.rowner = true
export default handler
