import fetch from 'node-fetch'
import {
    Couples
} from 'dhn-api'
const handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let x = await Couples()
    conn.sendFile(m.chat, x.female, "female", `*[ C E W E ]*`, m)
    conn.sendFile(m.chat, x.male, "male", `*[ C O W O ]*`, m)
}
handler.tags = ['fun']
handler.command = ['ppcp']
export default handler
