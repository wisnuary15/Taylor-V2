const handler = async (m, {
  conn,
  usedPrefix
}) => {
  const user = db.data.users[m.sender];
  const __timers = Date.now() - user.lastnambang;
  const _timers = 10800000 - __timers;
  const timers = clockString(_timers);
  const penambang = conn.getName(m.sender);
  if (user.stamina < 20) return m.reply(`Stamina tidak cukup\nIsi stamina dengan *${usedPrefix}eat8*`);
  if (user.lastnambang > 10800000) throw m.reply(`Masih kelelahan\nTunggu ${timers} lagi`);
  const rndm = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const rndm1 = rndm(1, 5); // Diamond
  const rndm2 = rndm(5, 15); // Iron
  const rndm3 = rndm(10, 30); // Gold
  const rndm4 = rndm(20, 50); // Emerald
  const rndm5 = rndm(5, 25); // Rock
  const rndm6 = rndm(10, 40); // Clay
  const rndm7 = rndm(5, 15); // Coal
  const rndm8 = rndm(2, 10); // Sand
  const rndm9 = rndm(50, 100); // Exp
  const hsl = `
*《 Hasil Nambang ${penambang} 》*

💎 = [ ${rndm1} ] Diamond
⛓️ = [ ${rndm2} ] Iron
🪙 = [ ${rndm3} ] Gold
💚 = [ ${rndm4} ] Emerald
🪨 = [ ${rndm5} ] Rock
🌕 = [ ${rndm6} ] Clay
🕳️ = [ ${rndm7} ] Coal
🌑 = [ ${rndm8} ] Sand
✉️ = [ ${rndm9} ] Exp

Stamina berkurang -20
`;
  user.diamond += rndm1;
  user.iron += rndm2;
  user.gold += rndm3;
  user.emerald += rndm4;
  user.rock += rndm5;
  user.clay += rndm6;
  user.coal += rndm7;
  user.sand += rndm8;
  user.exp += rndm9;
  user.stamina -= 20;
  await conn.loadingMsg(m.chat, `🔍 ${penambang} Mencari Area Nambang.....`, hsl, [
    '⬛⬛⬛⬛⬛⬛⬛⬛🚶⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳', // Step 1
    '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬜⬛⬜⬜⬜⬛🚶\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🌳', // Step 2
    '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🌳🌳🚶', // Step 3
    '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n⬛⬜⬜⬛⬛⬜⬜⬜⬛⬛\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n🏘️🏘️🏘️🏘️🌳🌳🏘️ 🚶', // Step 4
    `➕ ${penambang}\n💹 Menerima gaji....` // Step 5
  ], m);
  user.lastnambang = Date.now();
};
handler.help = ['nambang'];
handler.tags = ['rpg'];
handler.command = /^(nambang|menambang)$/i;
handler.group = true;
export default handler;

function clockString(ms) {
  const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return ['\n' + d, ' Days ☀️\n ', h, ' Hours 🕐\n ', m, ' Minute ⏰\n ', s, ' Second ⏱️ '].map(v => v.toString()
    .padStart(2, 0)).join('');
}
