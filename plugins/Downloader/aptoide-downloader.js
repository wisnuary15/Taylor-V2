import axios from "axios"
import {
    download
} from "aptoide-scraper"
const handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    let regex = /^[a-z]\w*(\.[a-z]\w*)+$/i
    if (!regex.test(text)) throw "Input package name"
    try {
        let aptodl = await download(text)
        m.reply(wait)
        let {
            name,
            lastup,
            size,
            icon,
            dllink
        } = aptodl
        let cap = "*Name:* " + name + "\n" + "*Lastup:* " + lastup + "\n" + "*Size:* " + size + "\n\n" + wait
        conn.sendFile(m.chat, icon, "", cap, m)
        conn.sendFile(m.chat, dllink, name, null, m, true, {
            quoted: m,
            mimetype: "application/vnd.android.package-archive"
        })
    } catch (e) {
        m.reply(eror)
    }
}
handler.help = ["aptoidedown"]
handler.tags = ["tools"]
handler.command = /^ap(ptoided(own|l)|toided(own|l))$/i
export default handler
