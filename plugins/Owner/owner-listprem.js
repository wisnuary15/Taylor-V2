const handler = async (m, {
    conn,
    command,
    args
}) => {
    if (command === "listpremium") {
        let prem = prems
            ?.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
            ?.filter(v => v !== conn.user.jid);
        if (!prem || prem.length === 0) {
            m.reply("Tidak ada user premium");
        } else {
            let teks = "▢ *Pengguna Premium*\n─────────────\n" + prem?.map(v => '• @' + v.replace(/@.+/, '')).join('\n');
            m.reply(teks, null, {
                mentions: conn.parseMention(teks)
            });
        }
    } else {
        let users = Object.entries(db.data.users)
            ?.filter(([key, value]) => value.premiumTime)
            ?.map(([key, value]) => ({
                ...value,
                jid: key
            }));
        if (!users || users.length === 0) {
            m.reply("Tidak ada user premium");
            return;
        }
        let premiumTime = db.data.users[m.sender]?.premiumTime || 0;
        let prem = db.data.users[m.sender]?.premium || false;
        let waktu = clockString(premiumTime - new Date().getTime());
        let sortedP = users.sort((a, b) => b.premiumTime - a.premiumTime);
        let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedP.length);
        let myName = await conn.getName(m.sender);
        let names = await Promise.all(sortedP.slice(0, len)?.map(async ({
            jid,
            registered
        }) => {
            return registered ? db.data.users[jid].name : await conn.getName(jid);
        }));
        let myPrem = `┌✦ *⚕️My Premium Time⚕️*\n` +
            `┊• *👤Nama:* ${myName}\n` +
            `┊• *PremiumTime:* ${prem ? waktu : 'Expired 🚫'}\n` +
            `╚┈┈┈┈┈┈┈┈┈✧\n`;
        let allPrem = `–––『 𝗔𝗟𝗟 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 』–––\n\n` +
            sortedP.slice(0, len)?.map(({
                    jid,
                    premiumTime
                }, i) =>
                `┌✦ ( ${i + 1} )\n` +
                `┊👤 Nama: ${names[i]}\n` +
                `┊☎ Nomor: ${jid.split('@')[0]}\n` +
                `┊ *Link:* wa.me/${jid.split('@')[0]}\n` +
                `┊ *Waktu Premium:* ${premiumTime > new Date().getTime() ? clockString(premiumTime - new Date().getTime()) : 'Expired 🚫'}\n` +
                `╚┈┈┈┈┈┈┈┈┈✧`
            ).join('\n');
        let capt = myPrem + "\n" + allPrem;
        m.reply(capt, null, {
            mentions: conn.parseMention(capt)
        });
    }
};
handler.help = ['premlist [angka]'];
handler.tags = ['info'];
handler.command = ['listprem', 'premlist', 'listpremium'];
export default handler;

function clockString(ms) {
    if (ms <= 0) return 'Expired 🚫';
    let [ye, mo, d, h, m, s] = [31104000000, 2592000000, 86400000, 3600000, 60000, 1000]?.map(u => Math.floor(ms / u) % (u === 1000 ? 60 : (u === 2592000000 ? 12 : (u === 31104000000 ? 10 : 30))));
    return ['\n┊', ye, ' *Tahun 🗓️*\n', '┊', mo, ' *Bulan 🌙*\n', '┊', d, ' *Hari ☀️*\n', '┊', h, ' *Jam 🕐*\n', '┊', m, ' *Menit ⏰*\n', '┊', s, ' *Detik ⏱️*'].join('');
}

function sort(property, ascending = true) {
    return (a, b) => (ascending ? 1 : -1) * (a[property] - b[property]);
}
