const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    if (!text) throw "input text"
    try {
        m.reply(wait)
        conn.sendFile(m.chat, "https://api.yanzbotz.my.id/api/text2img/neima?prompt=" + text, text, "*[ Result ]*\n" + text, m)
    } catch (e) {
        throw eror
    }
}
handler.help = ["neima"]
handler.tags = ["internet"]
handler.command = /^neima$/i
export default handler
