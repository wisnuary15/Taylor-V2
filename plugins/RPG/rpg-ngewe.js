const handler = async (m, {
    conn
}) => {
    const user = db.data.users[m.sender];
    const __timers = Date.now() - user.lastngojek;
    const _timers = 300000 - __timers;
    const timers = clockString(_timers);
    const name = await conn.getName(m.sender);
    if (Date.now() - user.lastngojek > 300000) {
        const randomaku1 = Math.floor(Math.random() * 10);
        const randomaku2 = Math.floor(Math.random() * 10);
        const randomaku3 = Math.floor(Math.random() * 10);
        const randomaku4 = Math.floor(Math.random() * 5);
        const randomaku5 = Math.floor(Math.random() * 10);
        const rbrb1 = randomaku1 * 2;
        const rbrb2 = randomaku2 * 10;
        const rbrb3 = randomaku3 * 1;
        const rbrb4 = randomaku4 * 15729;
        const rbrb5 = randomaku5 * 20000;
        const hsl = `
*—[ Hasil Ngewe ${name} ]—*
 ➕ 💹 Uang = [ ${rbrb4} ]
 ➕ ✨ Exp = [ ${rbrb5} ] 
 ➕ 📛 Warn = +1		 
 ➕ 😍 Order Selesai = +1
➕  📥Total Order Sebelumnya : ${user.ojekk + 1}
`;
        user.warn++;
        user.money += rbrb4;
        user.exp += rbrb5;
        user.ojekk++;
        await conn.loadingMsg(m.chat, `🔍 Mencari pelanggan.....`, hsl, [
            '✔️ Mendapatkan pelanggan....',
            '🥵 Mulai mengocok.....',
            '🥵Ahhhh, Sakitttt!! >////<\n💦Crotttt.....',
            '🥵💦💦Ahhhhhh😫'
        ], m);
        user.lastngojek = Date.now();
    } else {
        conn.reply(m.chat, `Anda sudah lelah, silakan istirahat dulu sekitar\n🕔 *${timers}*`, m);
    }
};
handler.help = ['ngewe'];
handler.tags = ['rpg'];
handler.command = /^(ngewe|anu)$/i;
handler.register = true;
handler.premium = true;
export default handler;

function clockString(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return [h, m, s]?.map(v => v.toString().padStart(2, 0)).join(':');
}
