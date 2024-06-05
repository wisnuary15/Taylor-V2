import fetch from "node-fetch"
const handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    text,
    args
}) => {
    if (!Number(text)) return m.reply("input number")
    m.reply(wait)
    let res = await fetch('https://civitai.com/api/v1/models')
    let jso = await res.json()
    let resu = jso.items[text].modelVersions[0]?.images[0]?.meta.prompt
    m.reply(resu)
}
handler.help = ["civitai"]
handler.tags = ["misc"]
handler.command = /^(civitai)$/i
export default handler
