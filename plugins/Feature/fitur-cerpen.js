import {
    Cerpen
} from 'dhn-api'
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    m.reply(wait)
    try {
        let item = await Cerpen()
        let cap = `🔍 *[ RESULT ]*

${item}
`
        m.reply(cap)
    } catch (e) {
        m.reply(eror)
    }
}
handler.help = ["cerpen"]
handler.tags = ["internet"]
handler.command = /^(cerpen)$/i
export default handler
/* New Line */
