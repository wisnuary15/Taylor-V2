let handler = async (m, { conn, text }) => {
    if (!text) throw 'Mau nge cheat siapa sayang?';

    let who;
    if (m.isGroup) {
        who = m.mentionedJid[0];
    } else {
        who = m.chat;
    }

    if (!who) throw 'Tag pengguna yang ingin di-reset!';

    let user = global.db.data.users[who];
    if (!user) throw 'Pengguna tidak ditemukan dalam database.';

    user.diamond = -Infinity;
    user.exp = -Infinity;
    user.level = -Infinity;
    user.umur = -Infinity;

    conn.reply(m.chat, 'Sukses Ayang!', m);
}

handler.help = ['resetall'];
handler.tags = ['owner'];
handler.command = /^resetall(user)?$/i;
handler.owner = true;

export default handler;
