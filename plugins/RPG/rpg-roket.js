const handler = async (m, {
  conn
}) => {
  let __timers = (new Date - db.data.users[m.sender].lastroket)
  let _timers = (300000 - __timers)
  let order = db.data.users[m.sender].roket
  let timers = clockString(_timers)
  let name = conn.getName(m.sender)
  let user = db.data.users[m.sender]
  if (user.stamina < 20) return m.reply(
    `Stamina anda tidak cukup\nharap isi stamina anda dengan *${usedPrefix}eat8`)
  if (user.lastroket > 10800000) throw m.reply(`Kamu masih kelelahan\nHarap tunggu ${timers} lagi`)
  if (new Date - db.data.users[m.sender].lastroket > 300000) {
    let ngerok1 = `${Math.floor(Math.random() * 10)}`
    let ngerok2 = `${Math.floor(Math.random() * 10)}`
    let ngerok4 = `${Math.floor(Math.random() * 5)}`
    let ngerok3 = `${Math.floor(Math.random() * 10)}`
    let ngerok5 = `${Math.floor(Math.random() * 10)}`.trim()
    let ngrk1 = (ngerok1 * 2)
    let ngrk2 = (ngerok2 * 10)
    let ngrk3 = (ngerok3 * 1)
    let ngrk4 = (ngerok4 * 15729)
    let ngrk5 = (ngerok5 * 120)
    var zero1 = `${ngrk1}`
    var zero2 = `${ngrk2}`
    var zero3 = `${ngrk3}`
    var zero4 = `${ngrk4}`
    var zero5 = `${ngrk5}`
    var rokit = `🌕


▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████
🚀

👨‍🚀 Memulai penerbangan....
`
    var rokit2 = `🌕


🚀
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████

➕ Dalam penerbangan....
`
    var rokit3 = `🌕🚀


▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
░█▀█▀█░█▀██░█▀█░█▄█▄█░
░█▀█▀█░█▀████▀█░█▄█▄█░
████████▀█████████████

➕ Sampai di tujuan....
`
    var rokit4 = `🌕🚀

➕ Sukses Mendarat.... 👨‍🚀`
    var hsl = `
*—[ Hasil Ngroket ${name} ]—*
 ➕ 💹 Uang = [ ${zero4} ]
 ➕ ✨ Exp = [ ${zero5} ] 		 
 ➕ 😍 Mendarat Selesai = +1
 ➕  📥Total Mendarat Sebelumnya : ${order}
`
    db.data.users[m.sender].money += ngrk4
    db.data.users[m.sender].exp += ngrk5
    db.data.users[m.sender].roket += 1
    await conn.loadingMsg(m.chat, `🔍 ${name} Mencari Lokasi.....`, hsl, [rokit, rokit2, rokit3, rokit4], m)
    user.lastroket = new Date * 1
  } else conn.reply(m.chat, `Sepertinya Anda Sudah Kecapekan Silahkan Istirahat Dulu sekitar\n🕔 *${timers}*`, m)
}
handler.help = ['roket']
handler.tags = ['rpg']
handler.command = /^(roket|ngroket|groket|jadiroket)$/i
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
