import fetch from 'node-fetch';
import { sticker } from '../../lib/sticker.js';

const handler = async (m, { conn, usedPrefix, text, command }) => {
    let [text1, text2, text3] = text.split`|`;

    if (!text) {
        let example = command.match(/^(meme[27]|meme[36])$/) ? 'sam|sung' : 'samsung';
        throw `Contoh penggunaan ${usedPrefix}${command} ${example}`;
    }

    let params = { apikey: global.lolkey };
    let url = command === 'meme1' || command === 'meme4' || command === 'meme5' ? 
              `https://api.lolhuman.xyz/api/${command}?${new URLSearchParams({ ...params, text })}` :
              command === 'meme9' ? 
              `https://api.lolhuman.xyz/api/creator/kannagen?${new URLSearchParams({ ...params, text })}` :
              command === 'meme10' ? 
              `https://api.lolhuman.xyz/api/creator/ohno?${new URLSearchParams({ ...params, text })}` :
              command === 'meme11' ? 
              `https://api.lolhuman.xyz/api/creator/changemymind?${new URLSearchParams({ ...params, text })}` :
              command === 'meme2' || command === 'meme7' || command === 'meme8' ? 
              `https://api.lolhuman.xyz/api/${command}?${new URLSearchParams({ ...params, text1, text2 })}` :
              `https://api.lolhuman.xyz/api/${command}?${new URLSearchParams({ ...params, text1, text2, text3 })}`;

    let caption = `Nihh banh ${command} nya`;
    await conn.sendFile(m.chat, url, '', caption, m);

    try {
        let stiker = await sticker(null, global.API(url), global.packname, global.author);
        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
        } else {
            throw stiker.toString();
        }
    } catch (e) {
        console.error(e);
        throw e.toString();
    }
};

handler.help = ['meme 1-11'];
handler.command = /^meme(1[01]|1|[2-9])$/i;
handler.tags = ['maker'];

export default handler;
