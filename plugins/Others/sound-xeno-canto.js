import fetch from "node-fetch"
const handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    let id = m.chat
    let UrlSearch = "https://xeno-canto.org/api/2/recordings?query="
    if (!text) throw "Input Query"
    try {
        m.reply(wait)
        let res = await fetch(UrlSearch + text)
        let jso = await res.json()
        let data = jso.recordings
        let list = data?.map((item, index) => `*${htki} 📺 Bird Sound 🔎 ${htka}*
*ID:* ${item.id}
*En:* ${item.en}
*Rec:* ${item.rec}
*Loc:* ${item.loc}
*Downloads:* ${item.file}
`).join("\n")
        m.reply(list)
    } catch (e) {
        m.reply(eror)
    }
}
handler.help = ["xeno"]
handler.tags = ["tools"]
handler.command = /^(xeno)$/i
export default handler
