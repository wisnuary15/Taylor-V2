const isSatir = /(([Kk]enao|[Bb]ims|[Aa]v)a|tumlul|Tumlul|[Gg]wejh|[Oo]kgey|[Ss]iava|[Kk]avan|tenan|[Aa](msu|f[ah])|[Mm]gak|lmao|[Pp]edo|([Bb]an|hoo)h|[Kk]nf)/i // tambahin sendiri
export async function before(m, {
    isAdmin,
    isBotAdmin
}) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = db.data.chats[m.chat]
    let bot = db.data.settings[this.user.jid] || {}
    const isAntiSatir = isSatir.exec(m.text)
    let hapus = m.key.participant
    let bang = m.key.id
    if (chat.antiSatir && isAntiSatir) {
        this.reply(m.chat, `*Kata Satir Terdeteksi!* ${isBotAdmin ? '' : '\n\n_Bot bukan atmin_'}`, m)
        if (isBotAdmin && bot.restrict) {
            // await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            db.data.users[m.sender].warn += 1
            db.data.users[m.sender].banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
        } else if (!bot.restrict) return m.reply('Semoga harimu suram!')
    }
    return !0
}
