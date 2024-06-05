import fetch from 'node-fetch';
import fs from 'fs';
const toM = a => '@' + a.split('@')[0];
const getRandomElement = list => list[Math.floor(Math.random() * list.length)];
const handler = async (m, {
    conn,
    groupMetadata,
    usedPrefix,
    text,
    args,
    command
}) => {
    const frep = {
        contextInfo: {
            externalAdReply: {
                title: wm,
                body: author,
                sourceUrl: snh,
                thumbnail: fs.readFileSync('./thumbnail.jpg')
            }
        }
    };
    const imgr = flaaa.getRandom();
    try {
        switch (command) {
        case 'kapankah':
            m.reply(`
*Pertanyaan:* ${m.text}
*Jawaban:* ${getRandomElement([10])} ${getRandomElement(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])} lagi ...
                `.trim(), null, m.mentionedJid ? {
                mentions: conn.parseMention(m.text)
            } : {});
            break;
        case 'akankah':
            m.reply(`
*Pertanyaan:* ${m.text}
*Jawaban:* ${getRandomElement(['Ya', 'Mungkin iya', 'Mungkin', 'Mungkin tidak', 'Tidak', 'Tidak mungkin'])}
                `.trim(), null, m.mentionedJid ? {
                mentions: conn.parseMention(m.text)
            } : {});
            break;
        case 'siapakah':
            const participants = groupMetadata.participants?.map(v => v.id);
            const randomParticipant = getRandomElement(participants);
            m.reply(`${toM(randomParticipant)} Dia bang.🗿`, null, {
                mentions: [randomParticipant]
            });
            break;
        case 'mengapa':
            m.reply(`
*Pertanyaan:* ${m.text}
*Jawaban:* ${getRandomElement(['Karena anda ganteng', 'Karna lo wibu :[', 'karna lo didikan wahyu', 'Karna gw gk tau', 'Lo punya jin', 'Tidak mungkin'])}
                `.trim(), null, m.mentionedJid ? {
                mentions: conn.parseMention(m.text)
            } : {});
            break;
        case 'bisakah':
            m.reply(`
*Pertanyaan:* ${m.text}
*Jawaban:* ${getRandomElement(['Ya', 'Mungkin iya', 'Mungkin', 'Mungkin tidak', 'Tidak', 'Tidak mungkin'])}
                `.trim(), null, m.mentionedJid ? {
                mentions: conn.parseMention(m.text)
            } : {});
            break;
        default:
            m.reply('Perintah tidak dikenali.');
            break;
        }
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};
handler.command = handler.help = ['kapankah', 'akankah', 'siapakah', 'mengapa', 'bisakah'];
handler.tags = ['kerang'];
export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
