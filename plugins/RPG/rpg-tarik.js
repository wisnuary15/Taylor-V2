const xpperlimit = 1;
const handler = async (m, {
    conn,
    command,
    args
}) => {
    const user = db.data.users[m.sender];
    let count = command.replace(/^tarik/i, '');
    count = count ? /all/i.test(count) ? Math.floor(user.bank / xpperlimit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
    count = Math.max(1, count);
    if (user.atm === 0) return conn.reply(m.chat, 'Kamu belum memiliki ATM!', m);
    if (user.bank >= xpperlimit * count) {
        user.bank -= xpperlimit * count;
        user.money += count;
        conn.reply(m.chat, `Sukses menarik sebesar ${count} Money 💹`, m);
    } else {
        conn.reply(m.chat, `[❗] Uang di bank Anda tidak mencukupi untuk ditarik sebesar ${count} money 💹`, m);
    }
};
handler.help = ['tarik <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^tarik([0-9]+)|tarik|tarikall$/i;
export default handler;
