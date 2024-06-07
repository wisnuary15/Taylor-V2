const handler = async (m, {
  conn,
  usedPrefix,
  DevMode
}) => {
  try {
    let user = db.data.users[m.sender];
    let lastMining = user.lastmining || 0;
    let timers = clockString(180000 - (new Date - lastMining));
    if (user.healt <= 79) return conn.reply(m.chat, 'Minimum 80 health to do chopping', m);
    if (new Date - lastMining < 180000) return conn.reply(m.chat, `Please wait ${timers} again`, m);
    let {
      armor,
      rubah,
      kuda,
      kucing
    } = user;
    let health = Math.floor(Math.random() * 101);
    let kucingnya = kucing > 0 ? [0, 5, 10, 15, 21, 30][kucing] : 0;
    let armornya = armor > 0 ? [0, 5, 10, 15, 21, 30][armor] : 0;
    let __health = health > 60 ? health - kucingnya - armornya : health;
    let healt = kucing === 0 && armor === 0 ? [100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90][Math.floor(Math
    .random() * 11)] : kucing > 0 && armor > 0 ? __health : health;
    let potion = Math.floor(Math.random() * 2);
    let common = Math.floor(Math.random() * 3);
    let uncommon = Math.floor(Math.random() * 2);
    let mythic = pickRandom([1, 0, 0, 1]);
    let legendary = pickRandom([1, 0, 0, 0]);
    let sampah = Math.floor(Math.random() * 300);
    let kayu = Math.floor(Math.random() * 150);
    let batu = Math.floor(Math.random() * 100);
    let iron = Math.floor(Math.random() * 100);
    let exp = Math.floor(Math.random() * 500);
    let uang = Math.floor(Math.random() * 500);
    conn.reply(m.chat, '↓Chopping:', m)
    let str = `
❤️ While you chopping, you got:
🗡️wood: ${kayu}
🔩Iron: ${iron}
💵Gold: ${uang}
⚜️Xp: ${exp}
and you got Additional gifts
💎diamond: ${diamond}
`.trim()
    conn.reply(m.chat, str, m)
    user.kayu += kayu;
    user.diamond += diamond;
    user.batu += batu;
    user.iron += iron;
    user.exp += exp;
    user.money += uang;
    user.lastmining = new Date();
  } catch (e) {
    console.log(e);
    conn.reply(m.chat, 'Error', m);
    if (DevMode) {
      let file = require.resolve(__filename);
      for (let jid of owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user
        .jid)) {
        conn.reply(jid, `${file} error\nNo: *${m.sender.split('@')[0]}*\nCommand: *${m.text}*\n\n*${e}*`, m);
      }
    }
  }
}
handler.help = ['chop', 'chopig'];
handler.tags = ['rpg'];
handler.command = /^(chop|choping)$/i;
export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clockString(ms) {
  if (isNaN(ms)) return '--';
  let d = Math.floor(ms / 86400000);
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return `\n${d.toString().padStart(2, 0)} *Days ☀️*\n ${h.toString().padStart(2, 0)} *Hours 🕐*\n ${m.toString().padStart(2, 0)} *Minute ⏰*\n ${s.toString().padStart(2, 0)} *Second ⏱️* `;
}
