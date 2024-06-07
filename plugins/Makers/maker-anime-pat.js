import fetch from 'node-fetch'
import {
  sticker
} from '../../lib/sticker.js'
//import db from '../../lib/database.js'
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  let who
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted?.sender : false
  else who = m.chat
  if (!who) throw `✳️ Tag or mention someone\n\n📌 Example : ${usedPrefix + command} @tag`
  let user = db.data.users[who]
  let name = conn.getName(who)
  let name2 = m.name
  m.react(wait)
  let rpat = await fetch(`https://api.waifu.pics/sfw/pat`)
  if (!rpat.ok) throw await rpat.text()
  let json = await rpat.json()
  let {
    url
  } = json
  let stiker = await sticker(null, url, `(${name2}) caress to`, `${name}`)
  conn.sendFile(m.chat, stiker, null, {
    asSticker: true
  }, m)
  m.reply('☺️')
}
handler.help = ['pat @tag']
handler.tags = ['anime']
handler.command = /^(acariciar|pat)$/i
handler.group = true
export default handler
