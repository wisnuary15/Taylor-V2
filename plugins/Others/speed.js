import _ from 'lodash';
import { cpus, freemem, totalmem, hostname, platform } from 'os';
import { statSync, readdirSync } from 'fs';
import { join } from 'path';
import osu from 'node-os-utils';
import fetch from 'node-fetch';
import { performance } from 'perf_hooks';
import sizeFormatter from 'human-readable';
import moment from 'moment-timezone';

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
});

const NotDetect = "ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ";

const getFolderSize = (folderPath) => {
  return statSync(folderPath).size + _.sumBy(readdirSync(folderPath), file => {
    const filePath = join(folderPath, file);
    return statSync(filePath).isDirectory() ? getFolderSize(filePath) : statSync(filePath).size;
  });
};

const clockString = (ms) => {
  const duration = moment.duration(ms);
  return `☀️ *${String(duration.days()).padStart(2, "0")}* Days\n` +
         `🕐 *${String(duration.hours()).padStart(2, "0")}* Hours\n` +
         `⏰ *${String(duration.minutes()).padStart(2, "0")}* Minutes\n` +
         `⏱️ *${String(duration.seconds()).padStart(2, "0")}* Seconds`;
};

const handler = async (m, { conn, isRowner }) => {
  try {
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const groupsIn = chats.filter(([id]) => id.endsWith("@g.us"));
    const used = process.memoryUsage();
    const cpusData = cpus().map(cpu => ({
      ...cpu,
      total: _.sum(Object.values(cpu.times))
    }));

    const cpu = _.reduce(cpusData, (result, cpu) => ({
      ...result,
      total: result.total + cpu.total,
      speed: result.speed + cpu.speed,
      times: _.mapValues(result.times, (time, type) => time + cpu.times[type])
    }), { speed: 0, total: 0, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } });

    const cpux = osu.cpu;
    const drive = osu.drive;
    const mem = osu.mem;
    const netstat = osu.netstat;

    const [cpuPer, driveInfo, memInfo, netInfo, ipInfo] = await Promise.all([
      cpux.usage().catch(() => NotDetect),
      drive.info().catch(() => ({ totalGb: NotDetect, usedGb: NotDetect, usedPercentage: NotDetect })),
      mem.info().catch(() => ({ totalMemMb: NotDetect, usedMemMb: NotDetect })),
      netstat.inOut().catch(() => ({ total: { inputMb: NotDetect, outputMb: NotDetect } })),
      fetch("https://api.myip.com").then(res => res.json()).catch(() => ({ ip: NotDetect, country: NotDetect, cc: NotDetect }))
    ]);

    const [ramUsed, ramTotal] = [format(1024 * memInfo.usedMemMb * 1024), format(1024 * memInfo.totalMemMb * 1024)];
    const percent = /[0-9.+/]/.test(memInfo.usedMemMb) && /[0-9.+/]/.test(memInfo.totalMemMb) ? `${Math.round(memInfo.usedMemMb / memInfo.totalMemMb * 100)}%` : NotDetect;
    const d = new Date(new Date() + 36e5);
    const [weeks, dates, times] = [
      d.toLocaleDateString("id", { weekday: "long" }),
      d.toLocaleDateString("id", { day: "numeric", month: "long", year: "numeric" }),
      d.toLocaleTimeString("id", { hour: "numeric", minute: "numeric", second: "numeric" })
    ];

    const old = performance.now();
    const neww = performance.now();

    const folderSession = `${format(getFolderSize(authFolder))}` || NotDetect;
    const credsSession = `${format(statSync(join(authFolder, "creds.json")).size)}` || NotDetect;
    const speed = neww - old;
    const muptime = process.send ? clockString(1000 * await new Promise(resolve => {
      process.send("uptime");
      process.once("message", resolve);
      setTimeout(resolve, 1000);
    })) : "ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ";

    const str = `- *ᴘ ɪ ɴ ɢ* -\n> ${Math.round(neww - old)}ms\n> ${speed}ms\n- *ʀ ᴜ ɴ ᴛ ɪ ᴍ ᴇ* -\n${muptime}\n${more.repeat(4001)}\n` +
                `- *ᴄ ʜ ᴀ ᴛ s* -\n• *${groupsIn.length}* Group Chats\n• *${groupsIn.length}* Groups Joined\n• *${groupsIn.length - groupsIn.length}* Groups Left\n` +
                `• *${chats.length - groupsIn.length}* Personal Chats\n• *${chats.length}* Total Chats\n- *s ᴇ ʀ ᴠ ᴇ ʀ* -\n*🛑 Rᴀᴍ:* ${ramUsed} / ${ramTotal} (${percent})\n` +
                `*🔵 FʀᴇᴇRᴀᴍ:* ${format(freemem())}\n*📑 ᴄʀᴇᴅꜱ sᴇssɪᴏɴ sɪᴢᴇ :* ${credsSession}\n*📑 ꜰᴏʟᴅᴇʀ sᴇssɪᴏɴ sɪᴢᴇ :* ${folderSession}\n` +
                `*🔭 ᴘʟᴀᴛғᴏʀᴍ:* ${platform()}\n*🧿 sᴇʀᴠᴇʀ:* ${hostname()}\n*💻 ᴏs:* ${platform()}\n*📍 ɪᴘ:* ${ipInfo.ip}\n*🌎 ᴄᴏᴜɴᴛʀʏ:* ${ipInfo.country}\n` +
                `*💬 ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ:* ${ipInfo.cc}\n*📡 ᴄᴘᴜ ᴍᴏᴅᴇʟ:* ${cpux.model()}\n*🔮 ᴄᴘᴜ ᴄᴏʀᴇ:* ${cpux.count()} Core\n*🎛️ ᴄᴘᴜ:* ${cpuPer}%\n` +
                `*⏰ ᴛɪᴍᴇ sᴇʀᴠᴇʀ:* ${times}\n- *ᴏ ᴛ ʜ ᴇ ʀ* -\n*📅 Wᴇᴇᴋꜱ:* ${weeks}\n*📆 Dᴀᴛᴇꜱ:* ${dates}\n*🔁 NᴇᴛꜱIɴ:* ${format(1024 * (netInfo.total?.inputMb || netstat.total.inputMb) * 1024)}\n` +
                `*🔁 NᴇᴛꜱOᴜᴛ:* ${format(1024 * (netInfo.total?.outputMb || netstat.total.outputMb) * 1024)}\n*💿 DʀɪᴠᴇTᴏᴛᴀʟ:* ${format(1024 * driveInfo.totalGb * 1024 * 1024)}\n` +
                `*💿 DʀɪᴠᴇUꜱᴇᴅ:* ${format(1024 * driveInfo.usedGb * 1024 * 1024)}\n*⚙️ DʀɪᴠᴇPᴇʀ:* ${driveInfo.usedPercentage}\n${more.repeat(4001)}\n` +
                `*${htjava} ɴᴏᴅᴇJS ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ*\n${"```" + Object.entries(used).map(([key, val]) => `${key.padEnd(_.maxBy(Object.keys(used), 'length').length)}: ${format(val)}`).join("\n") + "```"}`;

    const thumbnail = (await conn.getFile("https://cdn-icons-png.flaticon.com/128/9320/9320767.png")).data;

    await conn.sendMessage(m.chat, {
      text: str,
      contextInfo: {
        externalAdReply: {
          title: "🤖 Bot Speed",
          thumbnail: thumbnail
        },
        mentionedJid: [m.sender]
      }
    }, { quoted: m });

  } catch (error) {
    console.error(error);
  }
};

handler.help = ["ping", "speed"];
handler.tags = ["info", "tools"];
handler.command = /^(ping|speed|info)$/i;

export default handler;

const more = String.fromCharCode(8206);
