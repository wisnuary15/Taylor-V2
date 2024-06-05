const handler = async (m, {
    conn
}) => {
    const user = db.data.users[m.sender];
    const target = m.isGroup ? m.mentionedJid[0] : m.chat;
    if (!target) {
        throw 'Tag salah satu lah';
    }
    if (typeof db.data.users[target] === 'undefined') {
        throw 'Pengguna tidak ada didalam data base';
    }
    const timeSinceLastRob = new Date() - user.lastrob;
    const remainingTime = 3600000 - timeSinceLastRob;
    const timers = clockString(remainingTime);
    const robAmount = Math.floor(Math.random() * 100000);
    if (timeSinceLastRob > 3600000) {
        const targetMoney = db.data.users[target].money;
        if (targetMoney < 10000) {
            throw 'ᴛᴀʀɢᴇᴛ ɢᴀᴀᴅᴀ 💰ᴜᴀɴɢ ʙᴏᴅᴏʜ, ᴋɪꜱᴍɪɴ ᴅɪᴀ';
        }
        db.data.users[target].money -= robAmount;
        user.money += robAmount;
        user.lastrob = new Date() * 1;
        conn.reply(m.chat, `ʙᴇʀʜᴀꜱɪʟ ᴍᴇʀᴀᴍᴘᴏᴋ ᴍᴏɴᴇʏ ᴛᴀʀɢᴇᴛ ꜱᴇʙᴇꜱᴀʀ 💰${robAmount}`, m);
    } else {
        conn.reply(m.chat, `Anda Sudah merampok dan berhasil sembunyi, tunggu ${timers} untuk merampok lagi`, m);
    }
};
handler.help = ['merampok *@tag*'];
handler.tags = ['rpg'];
handler.command = /^merampok|rob$/;
handler.limit = true;
handler.group = true;
export default handler;

function clockString(ms) {
    let days = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let hours = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let minutes = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let seconds = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    days = (days < 10) ? '0' + days : days;
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return `${days} Days ☀️\n ${hours} Hours 🕐\n ${minutes} Minute ⏰\n ${seconds} Second ⏱️`;
}
