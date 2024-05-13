let handler = async (m, {
    conn
}) => {
    let lastHuntTime = global.db.data.users[m.sender].lastberbru || 0;
    let cooldown = 24 * 60 * 60 * 1000; // 1 day cooldown

    if (new Date() - lastHuntTime < cooldown) {
        let remainingCooldown = cooldown - (new Date() - lastHuntTime);
        let remainingTime = clockString(remainingCooldown);

        m.reply(`⏳ Mohon tunggu sebentar sebelum dapat berburu lagi.\n\n*Waktu Tersisa:*${remainingTime}`);
        return;
    }

    let habitats = {
        'Hutan 🌿': ['🐃 Banteng', '🐅 Harimau', '🐐 Kambing', '🐒 Monyet', '🐗 Babihutan', '🐖 Babi'],
        'Sabana 🦁': ['🐘 Gajah', '🐐 Kambing', '🐄 Sapi', '🐖 Babi'],
        'Taman Panda 🐼': ['🐼 Panda'],
        'Danau 🐊': ['🐊 Buaya', '🐄 Sapi', '🐖 Babi'],
        'Lembah 🐂': ['🐂 Kerbau', '🐄 Sapi', '🐖 Babi'],
        'Kebun 🐔': ['🐔 Ayam']
    };

    let results = {};

    m.reply(`🏞️ *${conn.getName(m.sender)} Sedang Berburu 🌿*\n\n`);

    setTimeout(() => {
        let res = `*🏞️ HASIL BERBURU ${conn.getName(m.sender)} 🏞️*\n\n`;
        for (let habitat in habitats) {
            res += `*${habitat}*\n`;
            for (let animal of habitats[habitat]) {
                let count = Math.floor(Math.random() * 100) + 1;
                res += `${animal}: ${count} ekor\n`;
                let animalName = animal.split(' ')[1].toLowerCase();
                if (!results[animalName]) results[animalName] = 0;
                results[animalName] += count;
            }
            res += '\n';
        }
        res += `*${author}* 🏕️`;

        let user = global.db.data.users[m.sender];
        for (let animal in results) {
            user[animal] += results[animal];
        }

        conn.reply(m.chat, res, null);
        user.lastberbru = new Date() * 1;
    }, 5000);
}

handler.help = ['berburu']
handler.tags = ['rpg']
handler.command = /^(berburu)$/i
handler.group = true

export default handler

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return ['\n' + d, ' *Hari ☀️*\n ', h, ' *Jam 🕐*\n ', m, ' *Menit ⏰*\n ', s, ' *Detik ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}