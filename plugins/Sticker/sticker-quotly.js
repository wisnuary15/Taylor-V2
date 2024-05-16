import axios from "axios";
import {
    sticker
} from "../../lib/sticker.js";
import wibusoft from "wibusoft";

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = await conn.getName(who);
    let reply = m.quoted ? {
        name: await conn.getName(m.quoted.sender),
        text: m.quoted.text || '',
        id: m.chat.split('@')[0]
    } : {};

    text = text || (m.quoted ? m.quoted.text : null);

    if (!text) throw "Input teks atau reply teks yang ingin dijadikan quote!";

    await m.reply(wait);
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(_ => logo);
    let temas = command === "quotly" ? "terang" : command === "quotlyv2" ? "gelap" : "random";
    let result = await Quotly(name, pp, text, temas, reply);

    try {
        let out = await wibusoft.tools.makeSticker(result, {
            author: packname,
            pack: name,
            keepScale: true
        });
        await m.reply(out);
    } catch (e) {
        let stick = await sticker(result, false, name, packname);
        await conn.sendFile(m.chat, stick, "Quotly.webp", "", m);
    }
};

handler.help = ["quotly", "quotlyv2", "quotlyv3"];
handler.tags = ["sticker"];
handler.command = ["quotly", "quotlyv2", "quotlyv3"];

export default handler;

async function Quotly(name, photoUrl, text, theme, reply) {
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
            avatar: true,
            from: {
                id: 1,
                name,
                photo: {
                    url: photoUrl
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
        try {
            const response = await axios.post("https://quotly.netorare.codes/generate", obj, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return Buffer.from(response.data.result.image, "base64");
        } catch (e) {
            throw new Error('Error generating quote image');
        }
    }
}