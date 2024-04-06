import {
    cpus as _cpus,
    totalmem,
    freemem
} from 'os';
import util from 'util';
import fs, {
    statSync,
    readdirSync
} from 'fs';
import {
    join
} from 'path';
import os, {
    hostname
} from 'os';
import osu from 'node-os-utils';
import fetch from 'node-fetch';
import {
    performance
} from 'perf_hooks';
import {
    sizeFormatter
} from 'human-readable';

const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
});

const handler = async (m, {
    conn,
    isRowner
}) => {
    try {
        const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
        const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
        const used = process.memoryUsage();
        const cpus = _cpus().map(cpu => {
            cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
            return cpu;
        });
        const cpu = cpus.reduce((last, cpu, _, {
            length
        }) => {
            last.total += cpu.total;
            last.speed += cpu.speed;
            Object.keys(cpu.times).forEach(type => last.times[type] += cpu.times[type]);
            return last;
        }, {
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
        const NotDetect = 'ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ';
        const cpux = osu.cpu;
        const cpuCore = cpux.count();
        const drive = osu.drive;
        const mem = osu.mem;
        const netstat = osu.netstat;
        const HostN = hostname();
        const OS = os.platform();
        const ipx = osu.os.ip();
        const cpuModel = cpux.model();
        const [cpuPer, driveInfo, memInfo, netInfo, {
            ip,
            country: cr,
            cc
        }] = await Promise.all([
            cpux.usage().then(cpuPercentage => cpuPercentage).catch(() => NotDetect),
            drive.info().catch(() => ({
                totalGb: NotDetect,
                usedGb: NotDetect,
                usedPercentage: NotDetect
            })),
            mem.info().catch(() => ({
                totalMemMb: NotDetect,
                usedMemMb: NotDetect
            })),
            netstat.inOut().catch(() => ({
                total: {
                    inputMb: NotDetect,
                    outputMb: NotDetect
                }
            })),
            fetch("https://api.myip.com").then(res => res.json()).catch(_ => ({
                ip: NotDetect,
                country: NotDetect,
                cc: NotDetect
            })),
        ]);
        const [_ramUsed, _ramTotal] = [format(memInfo.usedMemMb * 1024 * 1024) || NotDetect, format(memInfo.totalMemMb * 1024 * 1024) || NotDetect];
        const percent = /[0-9.+/]/g.test(memInfo.usedMemMb) && /[0-9.+/]/g.test(memInfo.totalMemMb) ? Math.round(100 * (memInfo.usedMemMb / memInfo.totalMemMb)) + '%' : NotDetect;
        const d = new Date(new Date + 3600000);
        const [weeks, dates, times] = [d.toLocaleDateString('id', {
            weekday: 'long'
        }), d.toLocaleDateString('id', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }), d.toLocaleTimeString('id', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })];
        const old = performance.now();
        const neww = performance.now();

        const getFolderSize = folderPath => statSync(folderPath).size + (readdirSync(folderPath) || []).reduce((acc, file) => acc + (statSync(join(folderPath, file)).isDirectory() ? getFolderSize(join(folderPath, file)) : statSync(join(folderPath, file)).size), 0);

        const folderSession = `${format(getFolderSize(authFolder))}` || NotDetect;
        const credsSession = `${format(statSync(join(authFolder, 'creds.json')).size)}` || NotDetect;

        const speed = neww - old;
        const _muptime = process.send ? await new Promise(resolve => {
            process.send('uptime');
            process.once('message', resolve);
            setTimeout(resolve, 1000);
        }) * 1000 : null;
        const muptime = _muptime ? clockString(_muptime) : 'ɴᴏᴛ ᴅᴇᴛᴇᴄᴛ';

        const str = `- *ᴘ ɪ ɴ ɢ* -
> ${Math.round(neww - old)}ms
> ${speed}ms

- *ʀ ᴜ ɴ ᴛ ɪ ᴍ ᴇ* -
${muptime}
${readMore}
- *ᴄ ʜ ᴀ ᴛ s* -
• *${groupsIn.length}* Group Chats
• *${groupsIn.length}* Groups Joined
• *${groupsIn.length - groupsIn.length}* Groups Left
• *${chats.length - groupsIn.length}* Personal Chats
• *${chats.length}* Total Chats

- *s ᴇ ʀ ᴠ ᴇ ʀ* -
*🛑 Rᴀᴍ:* ${_ramUsed} / ${_ramTotal} (${percent})
*🔵 FʀᴇᴇRᴀᴍ:* ${format(freemem())}
*📑 ᴄʀᴇᴅꜱ sᴇssɪᴏɴ sɪᴢᴇ :* ${credsSession}
*📑 ꜰᴏʟᴅᴇʀ sᴇssɪᴏɴ sɪᴢᴇ :* ${folderSession}
*🔭 ᴘʟᴀᴛғᴏʀᴍ:* ${OS}
*🧿 sᴇʀᴠᴇʀ:* ${HostN}
*💻 ᴏs:* ${OS}
*📍 ɪᴘ:* ${ip}
*🌎 ᴄᴏᴜɴᴛʀʏ:* ${cr}
*💬 ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ:* ${cc}
*📡 ᴄᴘᴜ ᴍᴏᴅᴇʟ:* ${cpuModel}
*🔮 ᴄᴘᴜ ᴄᴏʀᴇ:* ${cpuCore} Core
*🎛️ ᴄᴘᴜ:* ${cpuPer}%
*⏰ ᴛɪᴍᴇ sᴇʀᴠᴇʀ:* ${times}

- *ᴏ ᴛ ʜ ᴇ ʀ* -
*📅 Wᴇᴇᴋꜱ:* ${weeks}
*📆 Dᴀᴛᴇꜱ:* ${dates}
*🔁 NᴇᴛꜱIɴ:* ${format(netInfo.total.inputMb * 1024 * 1024)}
*🔁 NᴇᴛꜱOᴜᴛ:* ${format(netInfo.total.outputMb * 1024 * 1024)}
*💿 DʀɪᴠᴇTᴏᴛᴀʟ:* ${format(driveInfo.totalGb * 1024 * 1024 * 1024)}
*💿 DʀɪᴠᴇUꜱᴇᴅ:* ${format(driveInfo.usedGb * 1024 * 1024 * 1024)}
*⚙️ DʀɪᴠᴇPᴇʀ:* ${driveInfo.usedPercentage}

${readMore}
*${htjava} ɴᴏᴅᴇJS ᴍᴇᴍᴏʀʏ ᴜsᴀɢᴇ*
${'```' + Object.entries(used).map(([key, val]) => `${key.padEnd(Math.max(...Object.keys(used).map(v => v.length)), ' ')}: ${format(val)}`).join('\n') + '```'
}

$ {
    cpus[0] ?
        `*Total CPU Usage*
${cpus[0].model.trim()} (${Math.round(cpu.speed / cpus.length)} MHz)\n${Object.entries(cpu.times).map(([type, time]) => `- *${type}* ${(100 * time / cpu.total).toFixed(2)}%`).join('\n')}

*CPU Core(s) Usage (${cpus.length} Core CPU)*
${cpus.map((cpu, i) => `*${i + 1}.* ${cpu.model.trim()} (${Math.round(cpu.speed)} MHz)\n${Object.entries(cpu.times).map(([type, time]) => `> *${type}* ${(100 * time / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` :
        ''
}
`;

        const thumbnail = await conn.getFile("https://cdn-icons-png.flaticon.com/128/9320/9320767.png");
        await conn.sendMessage(m.chat, { text: str, contextInfo: { externalAdReply: { title: "🤖 Bot Speed", thumbnail: thumbnail.data, }, mentionedJid: [m.sender], }, }, { quoted: m });
    } catch (error) { console.error(error); }
};

handler.help = ['ping', 'speed'];
handler.tags = ['info', 'tools'];
handler.command = /^(ping|speed|info)$/i;

export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    return `☀️ * $ {
    d
}* Days\ n🕐 * $ {
    h
}* Hours\ n⏰ * $ {
    m
}* Minutes\ n⏱️ * $ {
    s
}* Seconds`;
}