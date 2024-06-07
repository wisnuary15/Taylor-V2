const handler = async (m, {
  conn
}) => {
  var ayg = db.data.users[m.sender]
  var beb = db.data.users[db.data.users[m.sender].pasangan]
  if (ayg.pasangan === "") {
    return conn.reply(m.chat, `Anda tidak memiliki pasangan.`, m)
  }
  if (typeof beb === "undefined") {
    conn.reply(m.chat, `Berhasil putus hubungan dengan @${db.data.users[m.sender].pasangan.split('@')[0]}`, m, {
      contextInfo: {
        mentionedJid: [db.data.users[m.sender].pasangan]
      }
    })
    ayg.pasangan = ""
  }
  if (m.sender === beb.pasangan) {
    conn.reply(m.chat, `Berhasil putus hubungan dengan @${db.data.users[m.sender].pasangan.split('@')[0]}`, m, {
      contextInfo: {
        mentionedJid: [db.data.users[m.sender].pasangan]
      }
    })
    ayg.pasangan = ""
    beb.pasangan = ""
  } else {
    conn.reply(m.chat, `Anda tidak memiliki pasangan.`, m)
  }
}
handler.help = ['putus']
handler.tags = ['jadian']
handler.command = /^(putus)$/i
handler.group = true
handler.fail = null
export default handler
