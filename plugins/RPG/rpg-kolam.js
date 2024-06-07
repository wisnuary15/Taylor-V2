const handler = async (m, {
  conn
}) => {
  const user = db.data.users[m.sender];
  const name = user.name;
  const level = user.level;
  const exp = user.exp;
  const paus = user.paus;
  const kepiting = user.kepiting;
  const gurita = user.gurita;
  const cumi = user.cumi;
  const buntal = user.buntal;
  const dory = user.dory;
  const lumba = user.lumba;
  const lobster = user.lobster;
  const hiu = user.hiu;
  const udang = user.udang;
  const ikan = user.ikan;
  const orca = user.orca;
  const past =
  `
*—「 KOLAM 🏝️ 」—*

*💌 Name :* ${name}
*📊 Level :* ${level}
*✨ Exp :* ${exp}

⛊━─┈────────┈─━⛊
🐳 Paus: *${paus}*   
🦀 Kepiting: *${kepiting}*   
🐙 Gurita: *${gurita}*   
🦑 Cumi: *${cumi}*   
🐡 Buntal: *${buntal}*  
🐠 Dory: *${dory}*
🐬 Lumba: *${lumba}*
🦞 Lobster: *${lobster}*
🦈 Hiu: *${hiu}*
🦐 Udang: *${udang}*
🐟 Ikan: *${ikan}*
🐋 Orca: *${orca}*
⛊━─┈────────┈─━⛊
🎏 Total Isi: *${paus + kepiting + gurita + cumi + buntal + dory + lumba + lobster + hiu + udang + ikan + orca}* Jenis`;
  const isi = `
🦀 Kepiting = ${kepiting}
🐠 Dory = ${dory}
🦞 Lobster = ${lobster}
🐟 Ikan = ${ikan}
🦐 Udang = ${udang}
🐬 Lumba² = ${lumba}
🦑 Cumi² = ${cumi}
🐋 Paus = ${paus}
🐙 Gurita = ${gurita}
🦈 Hiu = ${hiu}
🐡 Buntal = ${buntal}
🐳 Orca = ${orca}`.trim();
  conn.reply(m.chat, past + '\n\n' + isi, m);
};
handler.help = ['kotakikan', 'kolam', 'kolamikan'];
handler.tags = ['rpg'];
handler.command = /^(kotak(ikan)?|kolam(ikan)?)$/i;
handler.register = true;
export default handler;
