let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    try {
        if (!m.quoted && !text) {
            await conn.reply(m.chat, `Reply pesan report. Gunakan perintah ini:\n\nContoh:\n${usedPrefix + command} <reply/report>`, m)
            return;
        }

        let teks = `*BALASAN REPORT*\n\nDari: *@${m.sender.split`@`[0]}*\n\nPesan: ${text}\n`

        let response = await conn.reply((await conn.parseMention(m.quoted.text))[0], m.quoted ? teks + m.quoted.text : teks || m.text, null, {
            contextInfo: {
                mentionedJid: await conn.parseMention(m.quoted.text)
            }
        });

        if (response) {
            await conn.reply(m.chat, '_Pesan terkirim ke pengirim request/report._', m)
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, 'Terjadi kesalahan dalam mengirim laporan. Mohon coba lagi nanti.', m)
    }
}

handler.help = ['balasreport'].map(v => v + ' <reply/teks>')
handler.tags = ['info']
handler.command = /^(balas)(reports|masalah|report?|lapor|bug[gs]|bug)$/i
handler.limit = 10;
handler.owner = true;
handler.private = true;
export default handler