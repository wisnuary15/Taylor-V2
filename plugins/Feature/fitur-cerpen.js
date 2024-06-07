import {
  Cerpen
} from 'dhn-api'
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  m.react(wait)
  try {
    let item = await Cerpen()
    let cap = `🔍 *[ RESULT ]*

${item}
`
    m.reply(cap)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["cerpen"]
handler.tags = ["internet"]
handler.command = /^(cerpen)$/i
export default handler
/* New Line */
