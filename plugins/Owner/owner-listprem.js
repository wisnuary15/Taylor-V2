let handler = async (m, {
    conn,
    command,
    args
}) => {
    if (command === "listpremium") {
        let prem = global.prems
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
            .filter(v => v !== conn.user.jid);
        let teks = "▢ *PREMIUM USERS*\n─────────────\n" + prem.map(v => '- @' + v.replace(/@.+/, '')).join('\n');
        await m.reply(teks, null, {
            mentions: await conn.parseMention(teks)
        });
    } else {
        let user = Object.entries(global.db.data.users)
            .filter(user => user[1].premiumTime)
            .map(([key, value]) => ({
                ...value,
                jid: key
            }));

        let premiumTime = global.db.data.users[m.sender]?.premiumTime || 0;
        let prem = global.db.data.users[m.sender]?.premium || false;
        let waktu = clockString(premiumTime - new Date() * 1);

        let sortedP = user.map(toNumber('premiumTime')).sort(sort('premiumTime'));
        let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedP.length);

        let capt = " *PREMIUM*\n┌✦ *My Premium Time:*\n┊• *Name:* " + conn.getName(m.sender) + "\n" + (prem ? "┊• *PremiumTime:* " + waktu : '┊• *PremiumTime:* Expired 🚫') + "\n┗━═┅═━––––––๑\n\n•·–––––––––––––––––––––·•\n" + sortedP.slice(0, len).map(({
                jid,
                name,
                premiumTime,
                registered
            }) =>
            "┌✦\n" +
            (registered ? name : conn.getName(jid)) + "┊• wa.me/" + jid.split`@` [0] +
            (premiumTime > 0 ? ` ${clockString(premiumTime - new Date() * 1)}` : '┊ *EXPIRED 🚫*')
        ).join('\n') + "\n┗━═┅═━––––––๑".trim();
        await m.reply(capt, null, {
            mentions: await conn.parseMention(capt)
        });
    }
};

handler.help = ['premlist [angka]'];
handler.tags = ['info'];
handler.command = ['listprem', 'premlist', 'listpremium'];

export default handler;

function clockString(ms) {
    let [ye, mo, d, h, m, s] = [31104000000, 2592000000, 86400000, 3600000, 60000, 1000].map(u => isNaN(ms) ? '--' : Math.floor(ms / u) % (u === 1000 ? 60 : (u === 2592000000 ? 12 : (u === 31104000000 ? 10 : 30))));
    return ['┊', ye, ' *Years 🗓️*\n', '┊', mo, ' *Month 🌙*\n', '┊', d, ' *Days ☀️*\n', '┊', h, ' *Hours 🕐*\n', '┊', m, ' *Minute ⏰*\n', '┊', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('');
}

function sort(property, ascending = true) {
    return property ? (...args) => args[ascending & 1][property] - args[!ascending & 1][property] : (...args) => args[ascending & 1] - args[!ascending & 1];
}

function toNumber(property, _default = 0) {
    return property ? (a, i, b) => ({
        ...b[i],
        [property]: a[property] === undefined ? _default : a[property]
    }) : a => a === undefined ? _default : a;
}