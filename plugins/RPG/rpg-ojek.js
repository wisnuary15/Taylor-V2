const handler = async (m, {
  conn
}) => {
  let __timers = (new Date - db.data.users[m.sender].lastngojek)
  let _timers = (300000 - __timers)
  let order = db.data.users[m.sender].ojekk
  let timers = clockString(_timers)
  let name = conn.getName(m.sender)
  let user = db.data.users[m.sender]
  if (user.stamina < 20) return m.reply(
    `Stamina anda tidak cukup\nharap isi stamina anda dengan *${usedPrefix}eat8`)
  if (user.lastngojek > 10800000) throw m.reply(`Kamu masih kelelahan\nHarap tunggu ${timers} lagi`)
  if (new Date - db.data.users[m.sender].lastngojek > 300000) {
    let randomaku1 = `${Math.floor(Math.random() * 10)}`
    let randomaku2 = `${Math.floor(Math.random() * 10)}`
    let randomaku4 = `${Math.floor(Math.random() * 5)}`
    let randomaku3 = `${Math.floor(Math.random() * 10)}`
    let randomaku5 = `${Math.floor(Math.random() * 10)}`.trim()
    let rbrb1 = (randomaku1 * 2)
    let rbrb2 = (randomaku2 * 10)
    let rbrb3 = (randomaku3 * 1)
    let rbrb4 = (randomaku4 * 15729)
    let rbrb5 = (randomaku5 * 120)
    var zero1 = `${rbrb1}`
    var zero2 = `${rbrb2}`
    var zero3 = `${rbrb3}`
    var zero4 = `${rbrb4}`
    var zero5 = `${rbrb5}`
    var dimas = `
🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       🛵
✔️ Mendapatkan orderan....
`
    var dimas2 = `
🚶🛵⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       
➕ Mengantar ke tujuan....
`
    var dimas3 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛🛵⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️       
➕ Sampai di tujuan....
`
    var dimas4 = `
⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛
⬛⬛⬛⬛⬛⬛⬛🛵⬛⬛
🏘️🏘️🏘️🏘️🌳  🌳 🏘️ 🚶  
➕ 💹Menerima gaji....
`
    var hsl = `
*—[ Hasil Ngojek ${name} ]—*
 ➕ 💹 Uang = [ ${zero4} ]
 ➕ ✨ Exp = [ ${zero5} ] 		 
 ➕ 😍 Order Selesai = +1
➕  📥Total Order Sebelumnya : ${order}
`
    db.data.users[m.sender].money += rbrb4
    db.data.users[m.sender].exp += rbrb5
    db.data.users[m.sender].ojekk += 1
    await conn.loadingMsg(m.chat, `🔍 ${name} Mencari pelanggan.....`, hsl, [dimas, dimas2, dimas3, dimas4], m)
    user.lastngojek = new Date * 1
  } else conn.reply(m.chat, `Sepertinya Anda Sudah Kecapekan Silahkan Istirahat Dulu sekitar\n🕔 *${timers}*`, m)
}
handler.help = ['ojek']
handler.tags = ['rpg']
handler.command = /^(ojek|ngojek|gojek|jadiojek)$/i
handler.register = true
handler.group = true
export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString()
    .padStart(2, 0)).join('')
}
