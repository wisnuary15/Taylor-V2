const handler = async (m, {
    conn
}) => {
    if (new Date - db.data.users[m.sender].lastnguli > 86400000) {
        db.data.users[m.sender].limit += 10
        m.reply('_Selamat kamu mendapatkan +10 limit_')
        db.data.users[m.sender].lastnguli = new Date * 1
    } else m.reply('Anda sudah mengklaim upah nguli hari ini')
}
handler.help = ['nguli']
handler.tags = ['rpg']
handler.command = /^(nguli)$/i
handler.group = true
handler.fail = null
export default handler
