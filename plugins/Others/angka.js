const handler = async (m, {
  conn,
  args
}) => {
  try {
    let bonus = Math.floor(Math.random() * 3000);
    if (!args[0] || !/^\d$/.test(args[0])) throw 'Harap masukkan pilihan angkamu (0-9)';
    let angkaKamu = args[0]?.split('').map(Number);
    let angkaBot = angkaKamu.map(() => Math.floor(Math.random() * 10));
    let multiplier = args.slice(1).filter((v, i, a) => a.indexOf(v) === i).length || 1;
    conn.reply(m.chat, `
*「 TEBAK ANGKA 」*

Angka Kamu : ${angkaKamu.join(' ')}
Angka Bot  : ${angkaBot.join(' ')}
`.trim(), m);
    let kecocokan = angkaKamu.reduce((acc, val, i) => acc + (val === angkaBot[i]), 0);
    let penalty = (angkaKamu.length - kecocokan) * multiplier;
    let pesan = kecocokan === angkaKamu.length ? `Selamat, Anda menang! +${bonus * multiplier} XP!` :
      `Maaf, angka Anda tidak semua sama dengan angka bot. -${penalty} XP!`;
    conn.reply(m.chat, pesan + `
*「 HASIL PERMAINAN 」*

Angka Kamu : ${angkaKamu.join(' ')}
Angka Bot  : ${angkaBot.join(' ')}
Kecocokan  : ${kecocokan} / ${angkaKamu.length}
Bonus XP   : +${bonus * multiplier} XP
Penalty XP : -${penalty} XP
`.trim(), m);
    db.data.users[m.sender].exp += kecocokan === angkaKamu.length ? bonus * multiplier : -penalty;
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Terjadi kesalahan: ${error}`, m);
  }
};
handler.help = ['angka <0-9> [arg1] [arg2] ...'];
handler.tags = ['game'];
handler.command = /^angka/i;
handler.tigame = true;
handler.fail = null;
export default handler;
