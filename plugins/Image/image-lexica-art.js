import {
    NeoxrApi
} from '../../lib/tools/neoxr-api.js';
import fetch from 'node-fetch';

let handler = async (m, {
    args,
    command,
    usedPrefix,
    conn
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    try {
        let neo = new NeoxrApi('kyaOnechan');
        let res = await neo.diffusion(text);
        let randm = res.data;
        let resul = randm.getRandom();
        await m.reply(wait);
        await conn.sendFile(m.chat, resul.url, text, "*[ Result V1 ]*\n" + text, m);
    } catch (e) {
        try {
            let res = await (await fetch('https://lexica.art/api/v1/search?q=' + text)).json();
            let randm = res.images;
            let resul = randm.getRandom();
            await m.reply(wait);
            await conn.sendFile(m.chat, resul.src, text, "*[ Result V2 ]*\n" + resul.prompt, m);
        } catch (e) {
            await m.reply(eror);
        }
    }
};

handler.help = ["lexica"];
handler.tags = ['internet'];
handler.command = ["lexica"];

export default handler;