const xpperlimit = 1
const handler = async (m, {
    conn,
    command,
    args
}) => {
    let user = db.data.users[m.sender]
    let count = command.replace(/^tarik/i, '')
    count = count ? /all/i.test(count) ? Math.floor(db.data.users[m.sender].bank / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)
    if (user.atm === 0) return m.reply('kamu belum mempuyai atm !')
    if (db.data.users[m.sender].bank >= xpperlimit * count) {
        db.data.users[m.sender].bank -= xpperlimit * count
        db.data.users[m.sender].money += count
        conn.reply(m.chat, `Sukses menarik sebesar ${count} Money 💹`, m)
    } else conn.reply(m.chat, `[❗] Uang dibank anda tidak mencukupi untuk ditarik sebesar ${count} money 💹`, m)
}
handler.help = ['tarik']?.map(v => v + ' <jumlah>')
handler.tags = ['rpg']
handler.command = /^tarik([0-9]+)|tarik|tarikall$/i
export default handler
