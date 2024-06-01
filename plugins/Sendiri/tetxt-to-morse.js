import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        throw m.reply(`Masukkan textnya!\n\n*Contoh:* ${usedPrefix}${command} -. / .- / -. / --.. /`);
    }

    const apiUrl = `https://mfarels.my.id/api/sandi-morse2text?morse=${encodeURIComponent(text)}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        let json = await response.json();
        m.reply(json.result || json.data.data);
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat mengonversi sandi morse ke teks.');
    }
};

handler.command = handler.help = ['totextmorse'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;
