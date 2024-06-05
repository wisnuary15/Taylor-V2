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
const handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    let q = m.quoted || m;
    let mime = q.mimetype || '';
    if (/video/g.test(mime) && q.seconds > 11) return m.reply('Maksimal 10 detik!');
    if (!/webp|image|video|gif|viewOnce/g.test(mime)) return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command} input text`);
    m.reply(wait);
    let img = await q?.download()?.();
    let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
    let name = await conn.getName(who);
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => logo);
    let reply = m.quoted ? {
        name: await conn.getName(m.quoted.sender),
        text: m.quoted.caption || '',
        id: m.chat?.split('@')[0],
    } : null;
    text = text || m.quoted?.caption || '';
    if (!text) throw "Input teks atau reply teks yang ingin dijadikan quote!";
    let theme = command === "quotlyimg" ? "terang" : command === "quotlyimgv2" ? "gelap" : "random";
    let urls = /webp/g.test(mime) ? await QuotlyImg(await webp2png(img), name, pp, text, theme, reply) :
        /image/g.test(mime) ? await QuotlyImg(await uploadImage(img), name, pp, text, theme, reply) :
        await QuotlyImg(await uploadFile(img), name, pp, text, theme, reply);
    let out = await createSticker(urls, packname, name, 60);
    if (out) {
        m.reply(out);
    } else {
        throw new Error("Error generating sticker");
    }
};
handler.help = ["quotlyimg", "quotlyimgv2", "quotlyimgv3"];
handler.tags = ['sticker'];
handler.command = /^(quotlyimg|quotlyimgv2|quotlyimgv3)$/i;
export default handler;
async function QuotlyImg(url, name, pp, text, theme, reply) {
    const getRandomHexColor = () => `#${[...Array(3)]?.map(() => Math.floor(Math.random() * 200).toString(16).padStart(2, "0")).join('')}`;
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
                url: `https://wsrv.nl/?url=${url}&output=png`
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
            replyMessage: reply || {}
        }]
    };
    try {
        const response = await axios.post("https://quote.btch.bz/generate", obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return Buffer.from(response.data?.result?.image, "base64");
    } catch (e) {
        const fallbackResponse = await axios.post("https://quotly.netorare.codes/generate", obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return Buffer.from(fallbackResponse.data?.result?.image, "base64");
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
