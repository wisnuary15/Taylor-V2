const handler = async (m, {
    conn,
    usedPrefix,
    groupMetadata
}) => {
    const user = db.data.users[m.sender];
    const __timers = Date.now() - user.lastngocok;
    const _timers = 10800000 - __timers;
    const timers = clockString(_timers);
    const pengocok = await conn.getName(m.sender);
    const a = groupMetadata.participants?.map(v => v.id).getRandom();
    if (user.stamina < 20) return m.reply(`Stamina anda tidak cukup\nharap isi stamina anda dengan *${usedPrefix}eat8`);
    if (user.lastngocok > 10800000) throw m.reply(`Kamu masih kelelahan\nHarap tunggu ${timers} lagi`);
    const [rndm1, rndm2, rndm3, rndm4, rndm5, rndm6, rndm7, rndm8, rndm9] = Array(9).fill()?.map(() => Math.floor(Math.random() * 10));
    const [ran1, ran2, ran3, ran4, ran5, ran6, ran7, ran8, ran9] = [rndm1, rndm2, rndm3, rndm4, rndm5, rndm6, rndm7, rndm8, rndm9]?.map(v => v * 10);
    const [hmsil1, hmsil2, hmsil3, hmsil4, hmsil5, hmsil6, hmsil7, hmsil8, hmsil9] = [ran1, ran2, ran3, ran4, ran5, ran6, ran7, ran8, ran9];
    const jln = `⬛⬛⬛⬛⬛⬛⬛⬛🚶⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳\n✔️ ${pengocok} Mencari Target....`;
    const jln2 = `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛🚶\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳\n➕ ${pengocok} Menemukan Target....`;
    const jln3 = `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🚶\n➕ ${pengocok} Mulai Mengocok Bersama Target....`;
    const jln4 = `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🚶\n➕ ${pengocok}\n💹 Menerima Gaji Ngocok....`;
    const hsl = `
*《 Hasil Ngocok ${pengocok} 》*
 *💎 = [ ${hmsil1} ] Diamond*
 *⛓️ = [ ${hmsil2} ] Iron*
 *🪙 = [ ${hmsil3} ] Gold*
 *💚 = [ ${hmsil4} ] Emerald*
 *🪨 = [ ${hmsil5} ] Rock*
 *🌕 = [ ${hmsil6} ] Clay*
 *🕳️ = [ ${hmsil7} ] Coal*
 *🌑 = [ ${hmsil8} ] Sand*
 *✉️ = [ ${hmsil9} ] Exp*
 
 Stamina anda berkurang -20
 *Korban Ngocok:* @${a.split('@')[0]}
`;
    user.diamond += hmsil1;
    user.iron += hmsil2;
    user.gold += hmsil3;
    user.emerald += hmsil4;
    user.rock += hmsil5;
    user.clay += hmsil6;
    user.coal += hmsil7;
    user.sand += hmsil8;
    user.exp += hmsil9;
    user.stamina -= 20;
    await conn.loadingMsg(m.chat, `🔍 ${pengocok} Mencari Area ngocok.....`, hsl, [jln, jln2, jln3, jln4], m);
    user.lastngocok = Date.now();
};
handler.help = ['ngocok'];
handler.tags = ['rpg'];
handler.command = /^(ngocok|mengocok)$/i;
handler.group = true;
export default handler;

function clockString(ms) {
    const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* ']?.map(v => v.toString().padStart(2, 0)).join('');
}
