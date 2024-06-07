import {
  spawn
} from 'child_process'
const handler = async (m, {
  conn,
  isROwner,
  text
}) => {
  if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
  if (conn.user.jid === conn.user.jid) {
    m.reply('```R E S T A R T . . .```')
    process.send('reset')
  } else throw '_eeeeeiiittsssss..._'
}
handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(res(tart)?)$/i
handler.rowner = true
export default handler
