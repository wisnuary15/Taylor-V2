import fetch from 'node-fetch';
import util from 'util';

var handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia?`;

    await m.reply('Tunggu sebentar...');

    try {
        var response = await fetch(`https://hoshiyuki-api.my.id/api/openai?text=${encodeURIComponent(text)}&apikey=Hoshiyuki`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        var json = await response.json();

        await conn.sendMessage(m.chat, {
            text: json.result,
            contextInfo: {
                externalAdReply: { 
                    title: 'Chat GPT',
                    body: '',
                    thumbnailUrl: "https://telegra.ph/file/7a385897829927b981dfa.jpg",
                    sourceUrl: "https://github.com/AmmarrBN",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan Anda.');
    }
};

handler.command = handler.help = ['ai', 'openai', 'chatgpt'];
handler.tags = ['info'];
handler.limit = 3;

export default handler;
