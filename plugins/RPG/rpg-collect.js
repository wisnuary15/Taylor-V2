const handler = async (m, {
    conn
}) => {
    let user = db.data.users[m.sender];
    let lastClaim = user.lastclaim || 0;
    let timers = clockString(43200000 - (new Date - lastClaim));
    if (new Date - lastClaim > 43200000) {
        conn.reply(m.chat, `You have claimed and received *1000* 💵money and *1* 🥤potion`, m);
        user.money += 1000;
        user.potion += 1;
        user.lastclaim = new Date();
    } else {
        conn.reply(m.chat, `Please wait ${timers} again to claim again`, m);
    }
}
handler.help = ['collect'];
handler.tags = ['rpg'];
handler.command = /^(collect)$/i;
handler.fail = null;
export default handler;

function clockString(ms) {
    if (isNaN(ms)) return '--';
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return `\n${d.toString().padStart(2, 0)} *Days ☀️*\n ${h.toString().padStart(2, 0)} *Hours 🕐*\n ${m.toString().padStart(2, 0)} *Minute ⏰*\n ${s.toString().padStart(2, 0)} *Second ⏱️* `;
}
