import {
  cpus as _cpus,
  totalmem,
  freemem
} from 'os';
import {
  performance
} from 'perf_hooks';
import {
  sizeFormatter
} from 'human-readable';
import {
  join
} from 'path';
import {
  promises
} from 'fs';
import moment from 'moment-timezone';
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
});
const handler = async (m, {
  conn,
  __dirname
}) => {
  try {
    let date = moment.tz('Asia/Jakarta').format("dddd, Do MMMM, YYYY");
    let time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => '{}')) || {};
    let uptime = clockString(process.uptime() * 1000);
    let totalreg = Object.keys(db.data.users).length;
    let rtotalreg = Object.values(db.data.users).filter(user => user.registered).length;
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    const used = process.memoryUsage();
    const cpus = _cpus().map(cpu => {
      cpu.total = Object.values(cpu.times).reduce((last, type) => last + type, 0);
      return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, {
      length
    }) => ({
      total: last.total + cpu.total,
      speed: last.speed + cpu.speed / length,
      times: {
        user: last.times.user + cpu.times.user,
        nice: last.times.nice + cpu.times.nice,
        sys: last.times.sys + cpu.times.sys,
        idle: last.times.idle + cpu.times.idle,
        irq: last.times.irq + cpu.times.irq,
      }
    }), {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    });
    let speed = performance.now() - performance.now();
    let capti = `🤖 Nama: ${_package.name || 'N/A'}
🔢 Versi: ${_package.version || 'N/A'}
📚 Library: ${_package.description || 'N/A'}

⏳ Waktu Aktif: ${uptime}
📈 Pengguna Terdaftar: ${totalreg} (${rtotalreg} terverifikasi)

📅 Tanggal: ${date}
⌚ Waktu: ${time} (GMT +7)

💻 Info Server:
⮕ Ping: ${speed.toFixed(2)} ms
⮕ RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}

💬 Status WhatsApp:
⮕ ${groupsIn.length} Grup Chat
⮕ ${groupsIn.length} Grup Bergabung
⮕ ${chats.length - groupsIn.length} Chat Pribadi
⮕ ${chats.length} Total Chat`.trim();
    m.reply(capti);
  } catch (error) {
    console.error(error);
  }
};
handler.help = ['botinfo'];
handler.tags = ['info'];
handler.command = /^(bot(info)?|infobot)$/i;
export default handler;

function clockString(ms) {
  let d = Math.floor(ms / 86400000),
    h = Math.floor(ms / 3600000) % 24,
    m = Math.floor(ms / 60000) % 60,
    s = Math.floor(ms / 1000) % 60;
  return `${d} *Hari ☀️*\n${h.toString().padStart(2, '0')} *Jam 🕐*\n${m.toString().padStart(2, '0')} *Menit ⏰*\n${s.toString().padStart(2, '0')} *Detik ⏱️*`;
}
