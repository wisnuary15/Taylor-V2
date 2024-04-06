let handler = async (m, {
    conn
}) => {
    conn.tebakjkt48 = conn.tebakjkt48 ? conn.tebakjkt48 : {}
    let id = m.chat
    if (!(id in conn.tebakjkt48)) throw false
    let json = conn.tebakjkt48[id][1]
    conn.reply(m.chat, '```' + json.name.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}
handler.command = /^hjkt$/i

handler.limit = true

export default handler