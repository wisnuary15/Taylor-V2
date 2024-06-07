const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    let regex = /x/g
    if (!text) throw 'Input Number'
    if (!text.match(regex)) throw `Ex: ${usedPrefix + command} ${m.sender.split('@')[0]}x`
    let random = text.match(regex).length,
      total = Math.pow(10, random),
      array = []
    for (let i = 0; i < total; i++) {
      let list = [...i.toString().padStart(random, '0')]
      let result = text.replace(regex, () => list.shift()) + '@s.whatsapp.net'
      if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
        let info = await conn.fetchStatus(result).catch(_ => {})
        array.push({
          exists: true,
          jid: result,
          ...info
        })
      } else {
        array.push({
          exists: false,
          jid: result
        })
      }
    }
    let registered = array.filter(v => v.exists).map(v =>
      `*• No:* wa.me/${v.jid.split('@')[0]}\n*  Bio:* ${v.status || ''}\n*  Date:* ${formatDate(v.setAt)}`).join(
      '\n')
    let unregistered = array.filter(v => !v.exists).map(v => `*•* wa.me/${v.jid.split('@')[0]}`).join('\n')
    let txt = `*• Registered*\n\n${registered}\n\n*• Unregister*\n\n${unregistered}`
    m.reply(txt)
  } catch (error) {
    console.error(error)
    throw error
  }
}
handler.command = /^nowa$/i
export default handler

function formatDate(n, locale = 'id') {
  let d = new Date(n)
  return d.toLocaleDateString(locale, {
    timeZone: 'Asia/Jakarta'
  })
}
