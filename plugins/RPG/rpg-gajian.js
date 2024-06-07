const handler = async (m, {
  conn
}) => {
  const lastClaim = db.data.users[m.sender].lastclaim;
  const cdm = `${MeNit(new Date() - lastClaim)}`;
  const cds = `${DeTik(new Date() - lastClaim)}`;
  const cd1 = Math.ceil(44 - cdm);
  const cd2 = Math.ceil(59 - cds);
  if (new Date() - db.data.users[m.sender].lastclaim > 2700000) {
    db.data.users[m.sender].uang += 7000;
    db.data.users[m.sender].exp += 100;
    m.reply('Nih gaji lu +Rp7000');
    db.data.users[m.sender].lastclaim = new Date() * 1;
  } else {
    throw `Lu udah ambil jatah hari ini.\n\nTunggu ${cd1} Menit ${cd2} Detik!`;
  }
}
handler.help = ['gaji', 'gajian'];
handler.tags = ['rpg'];
handler.command = /^(gaji|gajian)$/i;
handler.group = true;
handler.register = true;
handler.exp = 0;
export default handler;

function JaM(ms) {
  const h = isNaN(ms) ? '60' : Math.floor(ms / 3600000) % 60;
  return [h].map(v => v.toString().padStart(2, 0)).join(':');
}

function MeNit(ms) {
  const m = isNaN(ms) ? '60' : Math.floor(ms / 60000) % 60;
  return [m].map(v => v.toString().padStart(2, 0)).join(':');
}

function DeTik(ms) {
  const s = isNaN(ms) ? '60' : Math.floor(ms / 1000) % 60;
  return [s].map(v => v.toString().padStart(2, 0)).join(':');
}
