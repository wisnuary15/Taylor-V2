const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  let fa = `\npenggunaan:\n${usedPrefix + command} angka\ncontoh:\n${usedPrefix + command} 100\n\nartinya kamu bertaruh 100 XP.\n\n*JACKPOT:* taruhan digandakan\n*kalah:* taruhan diambil`.trim();
  if (!args[0]) throw fa;
  if (isNaN(args[0])) throw fa;
  let taruhan = parseInt(args[0]),
    users = db.data.users[m.sender],
    time = users.lastslot + 1e4;
  if (new Date() - users.lastslot < 1e4) throw `tunggu selama ${msToTime(time - new Date())}`;
  if (taruhan < 1) throw "Minimal 1 XP!";
  if (users.exp < taruhan) throw "XP kamu tidak cukup!";
  let end, bet = ["🏆️", "🥇", "💵"],
    a = Math.floor(Math.random() * bet.length),
    b = Math.floor(Math.random() * bet.length),
    c = Math.floor(Math.random() * bet.length),
    x = [],
    y = [],
    z = [];
  for (let i = 0; i < 3; i++) x[i] = bet[a], a++, a === bet.length && (a = 0);
  for (let i = 0; i < 3; i++) y[i] = bet[b], b++, b === bet.length && (b = 0);
  for (let i = 0; i < 3; i++) z[i] = bet[c], c++, c === bet.length && (c = 0);
  return a === b && b === c ? (end = `JACKPOT! 🥳 *+${taruhan + taruhan} XP*`, users.exp += taruhan) : a === b || a === c || b === c ? end = "*TRY AGAIN!*" : (end = `LOSE 😥 *-${taruhan} XP*`, users.exp -= taruhan), users.lastslot = 1 * new Date(), await conn.reply(m.chat, `\n*[ 🎰 | SLOTS ]*\n\n${end}\n\n${x[0]} ${y[0]} ${z[0]}\n${x[1]} ${y[1]} ${z[1]}\n${x[2]} ${y[2]} ${z[2]}`.trim(), m);
};
handler.help = ["slot <angka>"], handler.tags = ["game"], handler.command = /^(slot?)$/i;
export default handler;

function msToTime(duration) {
  var seconds = Math.floor(duration / 1e3 % 60),
    minutes = Math.floor(duration / 6e4 % 60),
    hours = Math.floor(duration / 36e5 % 24);
  return hours = hours < 10 ? "0" + hours : hours, (minutes = minutes < 10 ? "0" + minutes : minutes) + " menit " + (seconds = seconds < 10 ? "0" + seconds : seconds) + " detik";
}
