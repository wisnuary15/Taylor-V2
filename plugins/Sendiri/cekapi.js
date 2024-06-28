import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Apikey (Khusus Apikey starter), Contoh:\n${usedPrefix}check AmmarBN`;

    try {
        const response = await fetch(`https://rest-api-flask-eosin.vercel.app/check?apikey=${text}`);
        const hasil = await response.text();

        if (response.ok) {
            m.reply(hasil.trim());
        } else {
            throw new Error(hasil.error || 'Terjadi kesalahan saat memeriksa API key');
        }
    } catch (error) {
        m.reply(`Error: ${error.message || error}`);
    }
};

handler.help = ['check <apikey>'];
handler.tags = ['info'];
handler.command = /^(check)$/i;
handler.premium = false;
handler.limit = false;

export default handler;
