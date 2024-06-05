const handler = async (m, {
    conn,
    args,
    usedPrefix
}) => {
    if (args.length > 0) {
        let mention = args[0]?.replace(/[@.+-]/g, '').replace(' ', '')
        let ban = m.mentionedJid[0] || m.quoted.sender || conn.parseMention(args[0]) || (args[0]?.replace(/[@.+-]/g, '').replace(' ', '') + '@s.whatsapp.net') || ''
        let warn = db.data.users[ban].warn
        if (warn < 5) {
            db.data.users[ban].warn += 1
            m.reply(`*berhasil Warn!*`)
            conn.reply(ban, '*Kamu di warn oleh moderator, dan sekarang kamu punya ' + (warn + 1) + ' warn. Ingat Jika kamu mendapat warn 5 kali kamu akan otomatis ke banned*', null)
        } else if (warn === 5) {
            db.data.users[ban].banned = true
            db.data.users[ban].warn = 0
            m.reply('*Dia sudah kebanned, karena mendapatkan 5 warn*')
            conn.reply(ban, '*Kamu ke banned karena telah mendapatkan 5 kali warn*', null)
        }
    } else conn.reply(m.chat, '*Siapa yang mau di Warn?\nTag orangnya*', m)
}
handler.help = ['warn @tag']
handler.tags = ['owner', 'moderator']
handler.command = /^warn$/i
handler.mods = true
export default handler
