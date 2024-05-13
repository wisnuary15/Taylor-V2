const timeout = 604800000;

const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const timeSinceLastMulung = new Date() - user.lastmulung;
    const timeLeft = timeout - timeSinceLastMulung;

    if (timeSinceLastMulung < timeout) {
        throw `📮Anda sudah merampok bank\nTunggu selama ⏲️ ${msToTime(timeLeft)} lagi`;
    }

    const botolnye = Math.floor(Math.random() * 30000);
    const kalengnye = Math.floor(Math.random() * 999);
    const kardusnye = Math.floor(Math.random() * 1000);

    user.money += botolnye;
    user.exp += kalengnye;
    user.kardus += kardusnye;
    user.lastmulung = new Date() * 1;

    m.reply(`Selamat kamu mendapatkan : \n💰+${botolnye} Money\n📦+${kardusnye} Kardus\n✨+${kalengnye} Exp`);

    setTimeout(() => {
        conn.reply(m.chat, `Yuk waktunya Maling lagi 👋…`, m);
    }, timeout);
};

handler.help = ['maling'];
handler.tags = ['rpg'];
handler.command = /^(maling)/i;
handler.limit = true;

export default handler;

function msToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + " jam " + minutes + " menit " + seconds + " detik";
}
