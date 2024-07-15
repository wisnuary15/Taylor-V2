const handler = async (m, {
  conn,
  usedPrefix,
  participants
}) => {
  conn.level = db.data.users[m.sender], conn.fightnaga = conn.fightnaga ? conn.fightnaga : {};
  if (void 0 !== conn.fightnaga[m.sender] && !0 === conn.fightnaga[m.sender]) return m.reply("*Tidak bisa melakukan battle ⚔️ karena Arena yang kamu miliki dipakai untuk fight pet mu yg lain.*");
  let users = participants.map(u => u.id);
  var lawan;
  for (lawan = users[Math.floor(users.length * Math.random())]; void 0 === db.data.users[lawan] || lawan === m.sender;) lawan = users[Math.floor(users.length * Math.random())];
  let lamaPertarungan = Acakin(8, 20);
  var time;
  m.reply(`*Pet Kamu* (🐴centaur ${db.data.users[m.sender].centaur}) ⚔️menantang 🐴centaurnya *${conn.getName(lawan)}* (🐴centaur ${db.data.users[lawan].centaur}) lagi berkelahi.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`),
    conn.fightnaga[m.sender] = !0, await (time = 6e4 * lamaPertarungan, new Promise(res => setTimeout(res, time)));
  let alasanKalah = ["Naikin lagi levelnya😐", "Cupu", "Kurang hebat", "Ampas Petnya", "Pet gembel"],
    alasanMenang = ["Hebat", "Pro", "Ganas Pet", "Legenda Pet", "Sangat Pro", "Rajin Ngasi Makan Pet"],
    kesempatan = [];
  for (i = 0; i < db.data.users[m.sender].centaur; i++) kesempatan.push(m.sender);
  for (i = 0; i < db.data.users[lawan].centaur; i++) kesempatan.push(lawan);
  let pointPemain = 0,
    pointLawan = 0;
  for (i = 0; i < 10; i++) unggul = Acakin(0, kesempatan.length - 1), kesempatan[unggul] === m.sender ? pointPemain += 1 : pointLawan += 1;
  if (pointPemain > pointLawan) {
    let hadiah = 2e4 * (pointPemain - pointLawan);
    db.data.users[m.sender].money += hadiah, db.data.users[m.sender].tiketcoin += 1,
      m.reply(`*${conn.getName(m.sender)}* [${10 * pointPemain}] - [${10 * pointLawan}] *${conn.getName(lawan)}*\n\n*Pet🐴Kamu* (centaur ${db.data.users[m.sender].centaur}) MENANG melawan 🐴centaurnya *${conn.getName(lawan)}* (centaur ${db.data.users[lawan].centaur}) karena centaur🐴kamu ${alasanMenang[Acakin(0, alasanMenang.length - 1)]}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`);
  } else if (pointPemain < pointLawan) {
    let denda = 1e5 * (pointLawan - pointPemain);
    db.data.users[m.sender].money -= denda, db.data.users[m.sender].tiketcoin += 1,
      m.reply(`*${conn.getName(m.sender)}* [${10 * pointPemain}] - [${10 * pointLawan}] *${conn.getName(lawan)}*\n\n*Pet🐴Kamu* (centaur ${db.data.users[m.sender].centaur}) KALAH melawan 🐴centaurnya *${conn.getName(lawan)}* (centaur ${db.data.users[lawan].centaur}) karena pet kamu ${alasanKalah[Acakin(0, alasanKalah.length - 1)]}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`);
  } else m.reply(`*${conn.getName(m.sender)}* [${10 * pointPemain}] - [${10 * pointLawan}] *${conn.getName(lawan)}*\n\nHasil imbang kak, ga dapet apa apa 😂`);
  delete conn.fightnaga[m.sender];
};
handler.help = ["fightcentaur"], handler.tags = ["game"], handler.command = /^(fightcentaur)$/i,
  handler.limit = !0, handler.group = !0;
export default handler;

function Acakin(min, max) {
  return min = Math.ceil(min), max = Math.floor(max), Math.floor(Math.random() * (max - min + 1)) + min;
}
