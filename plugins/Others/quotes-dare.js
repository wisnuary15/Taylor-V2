import {
  dare,
  truth,
  bucin
} from '@bochilteam/scraper'
const handler = async function(m, {
  conn,
  text,
  command,
  usedPrefix
}) {
  if (command === 'dare') {
    conn.reply(m.chat, await dare(), m)
  }
  if (command === 'truth') {
    conn.reply(m.chat, await truth(), m)
  }
  if (command === 'bucin') {
    conn.reply(m.chat, await bucin(), m)
  }
}
handler.command = handler.help = ['dare', 'truth', 'bucin']
handler.tags = ['quotes', 'fun']
export default handler
