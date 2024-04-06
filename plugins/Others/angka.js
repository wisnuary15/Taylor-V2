let bonus = `${Math.floor(Math.random() * 3000)}`.trim();

let handler = async (m, {
    conn,
    text,
    args
}) => {
    try {
        if (!args[0] || !/^\d$/.test(args[0])) {
            throw 'Harap masukkan pilihan angkamu (0-9)';
        }

        let random = pickRandom(['2', '9', '19', '25', '36', '58', '70', '92', '100', '500']);

        conn.reply(m.chat, `
*「 TEBAK ANGKA 」*

Angka Kamu : ${text}
Angka Bot : ${pickRandom(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}

Apakah Angkamu Dengan Bot Sama?

+${bonus} XP!
`.trim(), m);

        global.db.data.users[m.sender].exp += bonus * 1;
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `Terjadi kesalahan: ${error}`, m);
    }
};

handler.help = ['angka <0-9>'];
handler.tags = ['game'];
handler.command = /^angka/i;
handler.tigame = true;
handler.fail = null;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}