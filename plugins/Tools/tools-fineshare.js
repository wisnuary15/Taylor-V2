import {
    FineShare
} from '../../lib/ai/fineshare.js';

const createFine = new FineShare();

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    try {
        await m.react('🔎');

        let q = m.quoted ? m.quoted : m;
        let detail = !m.quoted && args[0] && await createFine.voiceDetail(args[0]);
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || '';
        let output = !m.quoted && args[0] && Object.entries(detail.data).map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join('\n');

        let media = mime.includes('audio') && args[0] && await q.download?.();
        let audio = media && await createFine.voiceChanger(args[0] || "jokowi", media);

        output && await m.reply(output);
        audio && await conn.sendFile(m.chat, audio, 'audio.mp3', '', m, null, {
            mimetype: 'audio/mp4'
        });

    } catch (error) {
        console.error(error);
        await m.reply('An error occurred while processing your request.');
    }
};

handler.help = ['fine'].map(v => v + ' <reply>');
handler.tags = ['audio'];
handler.command = /^(fine)$/i;

export default handler;