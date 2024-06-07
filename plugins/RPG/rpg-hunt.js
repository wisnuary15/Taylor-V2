const monsters = [{
  area: 1,
  name: "Goblin"
}, {
  area: 1,
  name: "Slime"
}, {
  area: 1,
  name: "Wolf"
}, {
  area: 2,
  name: "Nymph"
}, {
  area: 2,
  name: "Skeleton"
}, {
  area: 2,
  name: "Wolf"
}, {
  area: 3,
  name: "Baby Demon"
}, {
  area: 3,
  name: "Ghost"
}, {
  area: 3,
  name: "Zombie"
}, {
  area: 4,
  name: "Imp"
}, {
  area: 4,
  name: "Witch"
}, {
  area: 4,
  name: "Zombie"
}, {
  area: 5,
  name: "Ghoul"
}, {
  area: 5,
  name: "Giant Scorpion"
}, {
  area: 5,
  name: "Unicorn"
}, {
  area: 6,
  name: "Baby Robot"
}, {
  area: 6,
  name: "Sorcerer"
}, {
  area: 6,
  name: "Unicorn"
}, {
  area: 7,
  name: "Cecaelia"
}, {
  area: 7,
  name: "Giant Piranha"
}, {
  area: 7,
  name: "Mermaid"
}, {
  area: 8,
  name: "Giant Crocodile"
}, {
  area: 8,
  name: "Nereid"
}, {
  area: 8,
  name: "Mermaid"
}, {
  area: 9,
  name: "Demon"
}, {
  area: 9,
  name: "Harpy"
}, {
  area: 9,
  name: "Killer Robot"
}, {
  area: 10,
  name: "Dullahan"
}, {
  area: 10,
  name: "Manticore"
}, {
  area: 10,
  name: "Killer Robot"
}, {
  area: 11,
  name: "Baby Dragon"
}, {
  area: 11,
  name: "Young Dragon"
}, {
  area: 11,
  name: "Scaled Baby Dragon"
}, {
  area: 12,
  name: "Kid Dragon"
}, {
  area: 12,
  name: "Not so young Dragon"
}, {
  area: 12,
  name: "Scaled Kid Dragon"
}, {
  area: 13,
  name: "Definitely not so young Dragon"
}, {
  area: 13,
  name: "Teen Dragon"
}, {
  area: 13,
  name: "Scaled Teen Dragon"
}];
const handler = async (m, {
  conn
}) => {
  const user = db.data.users[m.sender];
  const pengirim = m.sender.split("@")[0];
  const timeSinceLastHunt = new Date() - user.lasthunt;
  const timeRemaining = 1200000 - timeSinceLastHunt;
  const timers = clockString(timeRemaining);
  if (timeSinceLastHunt > 1200000) {
    const area_monsters = monsters[Math.floor(Math.random() * monsters.length)];
    const monster = area_monsters.name.toUpperCase();
    const coins = Math.floor(Math.random() * 100000);
    const exp = Math.floor(Math.random() * 10000);
    const healing = Math.floor(Math.random() * 100);
    user.health -= healing;
    user.lasthunt = new Date() * 1;
    if (user.health < 0) {
      let msg = `*@${pengirim}* Anda Mati Di Bunuh Oleh ${monster}`;
      if (user.level > 0 && user.sword > 0) {
        user.level -= 1;
        user.sword -= 5;
        user.exp -= exp;
        msg += `\nLevel Anda Turun 1 Karena Mati Saat Berburu!\nSword Anda Berkurang 5 Karena Mati Saat Berburu!`;
      }
      user.health = 100;
      conn.reply(m.chat, msg, m, {
        mentions: conn.parseMention(msg)
      });
      return;
    }
    user.money += coins;
    user.exp += exp;
    user.tiketcoin += 1;
    const pesan =
      `Berhasil menemukan *${monster}*\n*@${pengirim}* Kamu sudah membunuhnya\nMendapatkan:\n${new Intl.NumberFormat('en-US').format(coins)} Money\n${new Intl.NumberFormat('en-US').format(exp)} XP\nBerkurang -${healing} Health, Tersisa ${user.health} Health\n+1 Tiketcoin`;
    conn.reply(m.chat, pesan, m, {
      mentions: conn.parseMention(pesan)
    });
  } else {
    throw `Tunggu ${timers} Untuk Berburu Lagi`;
  }
};
handler.help = ['hunt'];
handler.tags = ['game'];
handler.command = /^hunter|hunt/i;
handler.limit = true;
handler.group = true;
handler.fail = null;
export default handler;

function clockString(ms) {
  const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString()
    .padStart(2, 0)).join('');
}
