const timeout = 1800000;
const handler = async (m, {
    conn
}) => {
    const user = db.data.users[m.sender];
    const timeSinceLastMulung = new Date() - user.lastmulung;
    const remainingTime = timeout - timeSinceLastMulung;
    if (timeSinceLastMulung < timeout) {
        throw `Anda sudah lelah untuk mulung\nTunggu selama ${msToTime(remainingTime)} lagi`;
    }
    const botolnye = Math.floor(Math.random() * 1000);
    const kalengnye = Math.floor(Math.random() * 1000);
    const kardusnye = Math.floor(Math.random() * 1000);
    user.botol += botolnye;
    user.kaleng += kalengnye;
    user.kardus += kardusnye;
    user.lastmulung = new Date() * 1;
    m.reply(`Selamat kamu mendapatkan : \n+${botolnye} Botol\n+${kardusnye} Kardus\n+${kalengnye} Kaleng`);
    setTimeout(() => {
        conn.reply(m.chat, `Yuk waktunya mulung lagi 😅`, m);
    }, timeout);
};
handler.help = ['mulung'];
handler.tags = ['rpg'];
handler.command = /^(mulung)/i;
handler.group = true;
handler.limit = true;
export default handler;

function msToTime(duration) {
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let seconds = Math.floor((duration / 1000) % 60);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + " jam " + minutes + " menit " + seconds + " detik";
}
