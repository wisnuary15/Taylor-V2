const handler = async (m, {
    conn
}) => {
    let {
        lasthourly,
        lastberburu,
        lastbansos,
        lastadventure,
        lastfishing,
        lastwar,
        lastduel,
        lastmining,
        lastdungeon,
        lastclaim,
        lastweekly,
        lastmonthly
    } = db.data.users[m.sender]
    let warn = db.data.users[m.sender].warn
    let bann = db.data.users[m.sender].banned
    let str = `
*—「 🕖 Cooldown 」—*
*Last Berburu :* ${lastberburu > 0 ? '❌' : '✅'}
*Last Memancing :* ${lastfishing > 0 ? '❌' : '✅'}
*Last Adventure :* ${lastadventure > 0 ? '❌' : '✅'}
*Last Duel :* ${lastduel > 0 ? '❌' : '✅'}
*Last War :* ${lastwar > 0 ? '❌'  : '✅'}
*Last Dungeon :* ${lastdungeon > 0 ? '❌' : '✅'}
*Last Mining :* ${lastmining > 0 ? '❌' : '✅'}
*Last Bansos :* ${lastbansos > 0 ? '❌' : '✅'}
*Last Hourly :* ${lasthourly > 0 ? '❌' : '✅'}
*Last Claim :* ${lastclaim > 0 ? '❌' : '✅'}
*Last Weekly :* ${lastweekly > 0 ? '❌' : '✅'}
*Last Monthly :* ${lastmonthly > 0 ? '❌' : '✅'}
\n${readMore}
⚠️ *Warn:* ${warn}
⛔ *Banned:* ${bann}
`.trim()
    conn.reply(m.chat, str, m)
}
handler.help = ['cd', 'cooldown']
handler.tags = ['rpg']
handler.command = /^(cd|cooldown)$/i
handler.register = false
export default handler
const more = String.fromCharCode(8206)
const readMore = more.repeat(4201)
