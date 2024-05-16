import fetch from 'node-fetch';
import fs from 'fs';

export async function all(m) {
    if (!this || m.isBaileys || m.chat.endsWith('broadcast') || !m.sender) return;

    try {
        let pp = await this.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
        let stc = await fs.promises.readFile(`./sticker/ynkts${pickRandom(1, 9)}.webp`);

        if (/^(what|who|why|when|where|how|apa|dimana|kapan|siapa|mengapa|bagaimana)$/i.test(m.text) && m.isGroup) {
            await this.sendMessage(m.chat, {
                sticker: stc,
                thumbnail: await (await fetch(pp)).arrayBuffer(),
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 1,
                        mediaUrl: sig,
                        title: '「 ❔ 」',
                        body: wm,
                        sourceUrl: 'http://github.com/AyGemuy',
                        thumbnail: await (await fetch(pp)).arrayBuffer(),
                    },
                },
            }, {
                quoted: m,
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function pickRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}