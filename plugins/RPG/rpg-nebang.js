const handler = async (m, {
    conn,
    usedPrefix
}) => {
    const user = db.data.users[m.sender];
    const __timers = Date.now() - user.lastlumber;
    const _timers = 10800000 - __timers;
    const timers = clockString(_timers);
    const penebang = await conn.getName(m.sender);
    if (user.stamina < 20) return m.reply(`Stamina tidak cukup\nIsi stamina dengan *${usedPrefix}eat*`);
    if (user.lastlumber > 10800000) throw m.reply(`Masih kelelahan\nTunggu ${timers} lagi`);
    const rndm = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const rndm1 = rndm(1, 300); // Kayu
    const rndm2 = rndm(1, 3000); // Money
    const rndm3 = rndm(1, 300); // Exp
    const hsl = `
*《 Hasil Nebang ${penebang} 》*

🌳 = [ ${rndm1} ] Kayu
💹 = [ ${rndm2} ] Money
✉️ = [ ${rndm3} ] Exp

Stamina berkurang -20
`;
    user.axedurability -= 5;
    user.stamina -= 20;
    user.money += rndm2;
    user.kayu += rndm1;
    user.exp += rndm3;
    await conn.loadingMsg(m.chat, `🔍 ${penebang} Mencari Area nebang.....`, hsl, [
        '🚶⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳', // Step 1
        '⬛⬛⬛⬛⬛⬛🚶⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳', // Step 2
        '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛🚶\n🌳🏘️🌳🌳  🌳 🏘️ 🌳🌳🌳', // Step 3
        '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️ 🏘️ 🚶' // Step 4
    ], m);
    user.lastlumber = Date.now();
};
handler.help = ['nebang'];
handler.tags = ['rpg'];
handler.command = /^(nebang|menebang)$/i;
handler.group = true;
export default handler;

function clockString(ms) {
    const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return ['\n' + d, ' Days ☀️\n ', h, ' Hours 🕐\n ', m, ' Minute ⏰\n ', s, ' Second ⏱️ ']?.map(v => v.toString().padStart(2, 0)).join('');
}
