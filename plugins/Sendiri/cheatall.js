let handler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Command ini hanya bisa digunakan di grup.';

    let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[target];

    if (!user) throw 'Pengguna tidak ditemukan dalam database.';

    user.diamond = Infinity;
    user.exp = Infinity;
    user.level = Infinity;
    user.umur = Infinity;

    conn.reply(m.chat, 'Sukses Ayang!', m);
}

handler.help = ['cheatall'];
handler.tags = ['owner'];
handler.command = /^cheatall(user)?$/i;
handler.owner = true;

export default handler;
