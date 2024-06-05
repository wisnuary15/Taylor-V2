const handler = async (m, {
    command,
    conn,
    text
}) => {
    conn.anonymous = conn.anonymous ? conn.anonymous : {}
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let room = Object.values(conn.anonymous).find(room => room.check(who))
    if (!room) throw 'kamu tidak berada di anonymous chat'
    let other = room.other(who)
    var name
    if (text) name = text
    else name = await conn.getName(m.sender)
    var number = who.split('@')[0]
    let tks = `➔ Nomor: ${m.sender.split('@')[0]}
➔ Nama: ${name}`
    conn.reply(m.chat, 'Menggirimkan Kontak...')
    if (other) conn.reply(other, `Partner mengirimkan kontak kepadamu`)
    if (other) conn.sendFile(other, await conn.profilePictureUrl(m.sender, 'image').catch(_ => './thumbnail.jpg'), '', `${htki} ᴀɴᴏɴʏᴍᴏᴜs ᴄʜᴀᴛs ${htka}` + tks, m, {
        mentions: [m.sender]
    })
}
handler.help = ['sendkontak']
handler.tags = 'anonymous'
handler.command = /^(sendkontak)$/i
handler.private = true
export default handler
