export async function before(m) {
    this.listAfk = this.listAfk || {};
    let user = global.db.data.users[m.sender]
    if (user.afk > -1) {
        const idToRemove = m.sender;
        this.listAfk[m.chat] = this.listAfk[m.chat] ?
            this.listAfk[m.chat].filter(user => user.id !== idToRemove) : [];

        let caption = `
  ${this.getName(m.sender)} @${m.sender.split("@")[0]} berhenti AFK ${user.afkReason ? ' setelah ' + user.afkReason : ''}
  Selama ${(new Date - user.afk).toTimeString()}
  `.trim()
        let kataafk = ['mau turu', 'mau nyolong', 'Ke rumah ayang', 'jagain lilin', 'beli pop es', 'kawin lari', 'main kelereng', 'petak umpet', 'push renk', 'push up joni', 'olahraga', 'onani', 'beraq', 'open bo', 'di suruh emak', 'kerja']
        this.reply(m.chat, caption, m, {
            mentions: await this.parseMention(caption)
        })
        user.afk = -1
        user.afkReason = ''
    }
    let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    for (let jid of jids) {
        let user = global.db.data.users[jid]
        if (!user)
            continue
        let afkTime = user.afk
        if (!afkTime || afkTime < 0)
            continue
        let reason = user.afkReason || ''
        let caption = `
  Jangan tag ${this.getName(jid)} @${jid.split("@")[0]}!
  Dia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}
  Selama ${(new Date - afkTime).toTimeString()}
  `.trim()
        this.reply(m.chat, caption, m, {
            mentions: await this.parseMention(caption)
        })
    }
    return true
}