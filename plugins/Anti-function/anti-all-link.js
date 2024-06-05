const isLinkTik = /tiktok.com/i // tambahin sendiri
const isLinkYt = /youtube.com|youtu.be/i // tambahin sendiri
const isLinkTel = /t.me/i // tambahin sendiri
const isLinkFb = /facebook.com|fb.me/i // tambahin sendiri
const isLinkIg = /instagram.com/i // tambahin sendiri
const isLinkWa = /chat.whatsapp.com/i // tambahin sendiri
const isLinkHttp = /http|https/i // tambahin sendiri
export async function before(m, {
    isAdmin,
    isBotAdmin
}) {
    if (m.isBaileys && m.fromMe)
        return !0
    if (!m.isGroup) return !1
    let chat = db.data.chats[m.chat]
    let user = db.data.users[m.sender]
    let bot = db.data.settings[this.user.jid] || {}
    const isAntiLinkTik = isLinkTik.exec(m.text)
    const isAntiLinkYt = isLinkYt.exec(m.text)
    const isAntiLinkTel = isLinkTel.exec(m.text)
    const isAntiLinkFb = isLinkFb.exec(m.text)
    const isAntiLinkIg = isLinkIg.exec(m.text)
    const isAntiLinkWa = isLinkWa.exec(m.text)
    const isAntiLinkHttp = isLinkHttp.exec(m.text)
    let hapus = m.key.participant
    let bang = m.key.id
    if (chat.antiLinkTik && isAntiLinkTik) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkYt && isAntiLinkYt) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkTel && isAntiLinkTel) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkFb && isAntiLinkFb) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkIg && isAntiLinkIg) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkWa && isAntiLinkWa) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    if (chat.antiLinkHttp && isAntiLinkHttp) {
        this.reply(m.chat, "*[ Link Detected ]*", m)
        if (!isBotAdmin) return m.reply("Bot bukan *Admin*")
        if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !")
        if (isBotAdmin) {
            user.warn += 1
            user.banned = true
            return await this.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: bang,
                    participant: hapus
                }
            })
            return this.groupParticipantsUpdate(m.chat, [m.sender], "remove")
        }
    }
    return !0
}
