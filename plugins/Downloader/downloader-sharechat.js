import fetch from 'node-fetch'
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom())
  let name = conn.getName(who)
  if (!args[0]) throw `Use example ${usedPrefix}${command} https://sharechat.com/video/pDExqga`
  let res = await fetch(`https://api.lolhuman.xyz/api/sharechat?apikey=${lolkey}&url=${args[0]}`)
  let x = await res.json()
  conn.sendFile(m.chat, x.result.link_dl, '', `*${htki} ShareChat ${htka}*
*title:* ${x.result.title}
    `, m)
}
handler.help = ['sharechat'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^((sharechat)(downloder|dl)?)$/i
export default handler
