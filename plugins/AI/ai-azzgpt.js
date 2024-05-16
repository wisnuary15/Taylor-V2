import fetch from 'node-fetch';

const getazzgptResponse = async (q, u) => {
    try {
        const response = await fetch(`https://api.azz.biz.id/api/gpt?q=${q}&user=${u}&key=global`);
        const data = await response.json();
        return data.respon;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const handler = async (m, {
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    m.reply(wait);

    try {

        const response = await getazzgptResponse(text, m.name);

        m.reply(response);
    } catch (error) {
        console.error('Error:', error);
        m.reply(eror);
    }
};

handler.help = ['azzgpt'];
handler.tags = ['ai'];
handler.command = /^(azzgpt)$/i;

export default handler;