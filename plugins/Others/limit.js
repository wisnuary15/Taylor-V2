const handler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    if (args[0] === 'reset') {
        let list = Object.entries(db.data.users)
        let lim = !args || !args[0] ? 1000 : isNumber(args[0]) ? parseInt(args[0]) : 1000
        lim = Math.max(1, lim)
        list?.map(([user, data], i) => (Number(data.limit = lim)))
        conn.reply(m.chat, `*Berhasil direset ${lim} / user*`, fakes, adReply)
    }
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    let ke1 = db.data.users[who].limit
    let ke2 = db.data.users[who].exp
    let ke3 = db.data.users[who].money
    let caption = `
${dmenut} *B A N K  U S E R*
${dmenub} 📛 *Limit:* ${ke1}
${dmenub} 💳 *Exp:* ${ke2}
${dmenub} 🏛️ *Money:* ${ke3}
${dmenuf}
`
    conn.reply(m.chat, caption, fakes, adReply)
}
handler.help = ['limit [@user]']
handler.tags = ['xp']
handler.command = /^(limit)$/i
export default handler

function isNumber(x = 0) {
    x = parseInt(x)
    return !isNaN(x) && typeof x === 'number'
}
