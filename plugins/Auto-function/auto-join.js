let isJoin = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

export async function before(m, {
    usedPrefix,
    isAdmin,
    isBotAdmin,
    isOwner
}) {
    if (m.isBaileys && m.fromMe && !m.text) return false
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[this.user.jid] || {}
    const isAutoJoin = isJoin.exec(m.text)

    if (chat.autoJoin && isAutoJoin) {
        await this.reply(m.chat, `*Group link join detect!*`, m)
        return;
    }
}