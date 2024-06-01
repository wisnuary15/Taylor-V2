import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        let response = await fetch('https://raw.githubusercontent.com/AmmarrBN/dbbot/main/nsfw/neko.json');
        if (!response.ok) throw new Error('Failed to fetch data');

        let data = await response.json();
        let randomNeko = data.getRandom();

        if (!randomNeko) throw new Error('Failed to get a random Neko image');

        let imageResponse = await fetch(randomNeko);
        if (!imageResponse.ok) throw new Error('Failed to fetch Neko image');

        let imageBuffer = await imageResponse.buffer();
        conn.sendFile(m.chat, imageBuffer, null, 'Neko Chann~~', m);
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan.');
    }
}

handler.command = /^(nsfwneko)$/i;
handler.tags = ['nsfw'];
handler.help = ['nsfwneko'];
handler.private = true;
handler.register = true;
handler.berlian = true;

export default handler;
