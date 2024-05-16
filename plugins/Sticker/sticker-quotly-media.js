import uploadFile from '../../lib/uploadFile.js';
import uploadImage from '../../lib/uploadImage.js';
import {
    webp2png
} from '../../lib/webp2mp4.js';
import {
    Sticker,
    StickerTypes
} from 'wa-sticker-formatter';
import {
    sticker
} from '../../lib/sticker.js';
import axios from "axios";

let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');
    if (!/webp|image|video|gif|viewOnce/g.test(mime)) return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command} input text`);

    await m.reply(wait);
    let img = await q.download?.();
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(_ => logo);

    let reply = m.quoted ? {
        "name": await conn.getName(m.quoted.sender),
        "text": m.quoted.caption || '',
        "id": m.chat.split('@')[0],
    } : {};

    text = text || m.quoted?.caption || '';

    if (!text) throw "Input teks atau reply teks yang ingin dijadikan quote!";

    let temas = command === "quotlyimg" ? "terang" : command === "quotlyimgv2" ? "gelap" : "random";

    let urls;
    if (/webp/g.test(mime)) {
        urls = await QuotlyImg(await webp2png(img), name, pp, text, temas, reply);
    } else if (/image/g.test(mime)) {
        urls = await QuotlyImg(await uploadImage(img), name, pp, text, temas, reply);
    } else if (/video|gif|viewOnce/g.test(mime)) {
        urls = await QuotlyImg(await uploadFile(img), name, pp, text, temas, reply);
    }

    let out = await createSticker(urls, packname, name, 60);

    if (out) {
        await m.reply(out);
    } else {
        throw new Error("Error generating sticker");
    }
};

handler.help = ["quotlyimg", "quotlyimgv2", "quotlyimgv3"];
handler.tags = ['sticker'];
handler.command = ["quotlyimg", "quotlyimgv2", "quotlyimgv3"];

export default handler;

async function QuotlyImg(url, name, pp, text, theme, reply) {
    const getRandomHexColor = () => `#${[...Array(3)].map(() => Math.floor(Math.random() * 200).toString(16).padStart(2, "0")).join('')}`;

    const backgroundColor = theme === "terang" ? "#ffffff" :
        theme === "gelap" ? "#1b1429" : getRandomHexColor();

    const obj = {
        type: "quote",
        format: "png",
        backgroundColor,
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            media: {
                url
            },
            avatar: true,
            from: {
                id: 1,
                name,
                photo: {
                    url: pp
                }
            },
            text,
            replyMessage: reply
        }]
    };

    try {
        const response = await axios.post("https://quote.btch.bz/generate", obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return Buffer.from(response.data.result.image, "base64");
    } catch (e) {
        const fallbackResponse = await axios.post("https://quotly.netorare.codes/generate", obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return Buffer.from(fallbackResponse.data.result.image, "base64");
    }
}

async function createSticker(url, packName, authorName, quality) {
    const stickerMetadata = {
        type: StickerTypes.FULL,
        pack: packName,
        author: authorName,
        quality
    };
    return (new Sticker(url, stickerMetadata)).toBuffer();
}