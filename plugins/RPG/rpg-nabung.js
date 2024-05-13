const xpperlimit = 1;

const handler = async (m, { conn, command, args }) => {
    const user = global.db.data.users[m.sender];
    let count = command.replace(/^nabung/i, '');
    count = count ? /all/i.test(count) ? Math.floor(user.money / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
    count = Math.max(1, count);

    if (user.atm == 0) {
        return conn.reply(m.chat, 'Kamu belum memiliki ATM!', m);
    }

    if (user.bank > user.fullatm) {
        return conn.reply(m.chat, 'Uang di bankmu sudah penuh!', m);
    }

    if (count > user.fullatm - user.bank) {
        return conn.reply(m.chat, 'Uangnya tidak muat di bank!', m);
    }

    if (user.money >= xpperlimit * count) {
        user.money -= xpperlimit * count;
        user.bank += count;
        conn.reply(m.chat, `Sukses menabung sebesar ${count} Money 💹`, m);
    } else {
        conn.reply(m.chat, `[❗] Uang anda tidak mencukupi untuk menabung ${count} Money 💹`, m);
    }
};

handler.help = ['nabung <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^nabung([0-9]+)|nabung|nabungall$/i;
handler.group = true;

export default handler;
