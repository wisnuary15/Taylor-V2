import {
  cpus as _cpus,
  totalmem,
  freemem
} from "os";
import util from "util";
import fs, {
  statSync,
  readdirSync
} from "fs";
import {
  join
} from "path";
import os, {
  hostname
} from "os";
import osu from "node-os-utils";
import fetch from "node-fetch";
import {
  performance
} from "perf_hooks";
import {
  sizeFormatter
} from "human-readable";
import moment from "moment-timezone";
const format = sizeFormatter({
    std: "JEDEC",
    decimalPlaces: 2,
    keepTrailingZeroes: !1,
    render: (literal, symbol) => `${literal} ${symbol}B`
  }),
  handler = async (m, {
    conn,
    isRowner
  }) => {
    try {
      const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats),
        groupsIn = chats.filter(([id]) => id.endsWith("@g.us")),
        used = process.memoryUsage(),
        cpus = _cpus().map(cpu => ({
          ...cpu,
          total: Object.values(cpu.times).reduce((last, time) => last + time, 0)
        })),
        cpu = cpus.reduce((last, cpu) => ({
          ...last,
          total: last.total + cpu.total,
          speed: last.speed + cpu.speed,
          times: Object.fromEntries(Object.entries(last.times).map(([type, time], i) => [type, time + cpu.times[type]]))
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
        }),
        NotDetect = "ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ",
        cpux = osu.cpu,
        cpuCore = cpux.count(),
        drive = osu.drive,
        mem = osu.mem,
        netstat = osu.netstat,
        HostN = hostname(),
        OS = os.platform(),
        cpuModel = (osu.os.ip(), cpux.model()),
        [cpuPer, driveInfo, memInfo, netInfo, {
          ip,
          country: cr,
          cc
        }] = await Promise.all([cpux.usage().then(cpuPercentage => cpuPercentage).catch(() => NotDetect), drive.info().catch(() => ({
          totalGb: NotDetect,
          usedGb: NotDetect,
          usedPercentage: NotDetect
        })), mem.info().catch(() => ({
          totalMemMb: NotDetect,
          usedMemMb: NotDetect
        })), netstat.inOut().catch(() => ({
          total: {
            inputMb: NotDetect,
            outputMb: NotDetect
          }
        })), fetch("https://api.myip.com").then(res => res.json()).catch(_ => ({
          ip: NotDetect,
          country: NotDetect,
          cc: NotDetect
        }))]),
        [_ramUsed, _ramTotal] = [format(1024 * memInfo.usedMemMb * 1024) || NotDetect, format(1024 * memInfo.totalMemMb * 1024) || NotDetect],
        percent = /[0-9.+/]/g.test(memInfo.usedMemMb) && /[0-9.+/]/g.test(memInfo.totalMemMb) ? Math.round(memInfo.usedMemMb / memInfo.totalMemMb * 100) + "%" : NotDetect,
        d = new Date(new Date() + 36e5),
        [weeks, dates, times] = [d.toLocaleDateString("id", {
          weekday: "long"
        }), d.toLocaleDateString("id", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }), d.toLocaleTimeString("id", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        })],
        old = performance.now(),
        neww = performance.now(),
        getFolderSize = folderPath => statSync(folderPath).size + (readdirSync(folderPath) || []).reduce((acc, file) => acc + (statSync(join(folderPath, file)).isDirectory() ? getFolderSize(join(folderPath, file)) : statSync(join(folderPath, file)).size), 0),
        folderSession = `${format(getFolderSize(authFolder))}` || NotDetect,
        credsSession = `${format(statSync(join(authFolder, "creds.json")).size)}` || NotDetect,
        speed = neww - old,
        _muptime = process.send ? 1e3 * await new Promise(resolve => {
          process.send("uptime"), process.once("message", resolve), setTimeout(resolve, 1e3);
        }) : null,
        muptime = _muptime ? clockString(_muptime) : "ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ",
        str =
        `- *ᴘ ɪ ɴ ɢ* -\n> ${Math.round(neww - old)}ms\n> ${speed}ms\n- *ʀ ᴜ ɴ ᴛ ɪ ᴍ ᴇ* -\n${muptime}\n${readMore}\n- *ᴄ ʜ ᴀ ᴛ s* -\n• *${groupsIn.length}* Group Chats\n• *${groupsIn.length}* Groups Joined\n• *${groupsIn.length - groupsIn.length}* Groups Left\n• *${chats.length - groupsIn.length}* Personal Chats\n• *${chats.length}* Total Chats\n- *s ᴇ ʀ ᴠ ᴇ ʀ* -\n*🛑 Rᴀᴍ:* ${_ramUsed} / ${_ramTotal} (${percent})\n*🔵 FʀᴇᴇRᴀᴍ:* ${format(freemem())}\n*📑 ᴄʀᴇᴅꜱ sᴇssɪᴏɴ sɪᴢᴇ :* ${credsSession}\n*📑 ꜰᴏʟᴅᴇʀ sᴇssɪᴏɴ sɪᴢᴇ :* ${folderSession}\n*🔭 ᴘʟᴀᴛғᴏʀᴍ:* ${OS}\n*🧿 sᴇʀᴠᴇʀ:* ${HostN}\n*💻 ᴏs:* ${OS}\n*📍 ɪᴘ:* ${ip}\n*🌎 ᴄᴏᴜɴᴛʀʏ:* ${cr}\n*💬 ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ:* ${cc}\n*📡 ᴄᴘᴜ ᴍᴏᴅᴇʟ:* ${cpuModel}\n*🔮 ᴄᴘᴜ ᴄᴏʀᴇ:* ${cpuCore} Core\n*🎛️ ᴄᴘᴜ:* ${cpuPer}%\n*⏰ ᴛɪᴍᴇ sᴇʀᴠᴇʀ:* ${times}\n- *ᴏ ᴛ ʜ ᴇ ʀ* -\n*📅 Wᴇᴇᴋꜱ:* ${weeks}\n*📆 Dᴀᴛᴇꜱ:* ${dates}\n*🔁 NᴇᴛꜱIɴ:* ${format(1024 * netInfo.total.inputMb * 1024)}\n*🔁 NᴇᴛꜱOᴜᴛ:* ${format(1024 * netInfo.total.outputMb * 1024)}\n*💿 DʀɪᴠᴇTᴏᴛᴀʟ:* ${format(1024 * driveInfo.totalGb * 1024 * 1024)}\n*💿 DʀɪᴠᴇUꜱᴇᴅ:* ${format(1024 * driveInfo.usedGb * 1024 * 1024)}\n*⚙️ DʀɪᴠᴇPᴇʀ:* ${driveInfo.usedPercentage}\n${readMore}\n*${htjava} ɴᴏᴅᴇJS ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ*\n${"```" + Object.entries(used).map(([ key, val ]) => `${key.padEnd(Math.max(...Object.keys(used).map(v => v.length)), " ")}: ${format(val)}`).join("\n") + "```"}\n${ cpus[0] ? `*Total CPU Usage*\n${cpus[0]?.model.trim()} (${Math.round(cpu.speed / cpus.length)} MHz)\n${Object.entries(cpu.times).map(([ type, time ]) => `- *${type}* ${(100 * time / cpu.total).toFixed(2)}%`).join("\n")}\n*CPU Core(s) Usage (${cpus.length} Core CPU)*\n${cpus.map((cpu, i) => `*${i + 1}.* ${cpu.model.trim()} (${Math.round(cpu.speed)} MHz)\n${Object.entries(cpu.times).map(([ type, time ]) => `> *${type}* ${(100 * time / cpu.total).toFixed(2)}%`).join("\n")}`).join("\n\n")}` : "" }`, thumbnail = (await conn.getFile("https://cdn-icons-png.flaticon.com/128/9320/9320767.png")).data;
        await conn.sendMessage(m.chat, {
            text: str,
            contextInfo: {
                externalAdReply: {
                    title: "🤖 Bot Speed",
                    thumbnail: thumbnail
                },
                mentionedJid: [ m.sender ]
            }
        }, {
            quoted: m
        });
    } catch (error) {
        console.error(error);
    }
};

handler.help = [ "ping", "speed" ], handler.tags = [ "info", "tools" ], handler.command = /^(ping|speed|info)$/i;

export default handler;

const more = String.fromCharCode(8206), readMore = more.repeat(4001);

function clockString(ms) {
    const duration = moment.duration(ms);
    return `☀️ *${duration.days()}* Days\n🕐 *${duration.hours()}* Hours\n⏰ *${duration.minutes()}* Minutes\n⏱️ *${duration.seconds()}* Seconds`;
}