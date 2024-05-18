import {
    fetch
} from "undici"
import uploadImage from "../../lib/uploadImage.js"
import Bardie from "../../lib/ai/bardie.js"
const bard = new Bardie();
import {
    Gemini
} from "../../lib/ai/gemini.js"
const gemini = new Gemini('__Secure-1PSID', 'g.a000gQhbTE4WvC7mwVL4CcWSxbt1Bde7Ady6qpt6951pafinWART4EEKmcskZMFX08uuSKwbvAACgYKAVYSAQASFQHGX2Mi1KAIQT0oz9dXZXKy0ioMBBoVAUF8yKpem3c3iJtHRDMQF3nSHOxU0076');

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else return m.reply("Use *bard (text)* or *bardimg (text/media)*")
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ""
    await m.reply(wait)
    if (!mime) {
        try {
            let res = await RizzBard(text)
            await m.reply(res.content);
        } catch (e) {
            try {
                let res = await AemtBard(text)
                await m.reply(res);
            } catch (e) {
                try {
                    let res = await GoogleBard(text)
                    await m.reply(res);
                } catch (e) {
                    await m.reply(eror);
                }
            }
        }
    } else if (mime && command === "bardimg") {
        let media = await q.download()
        let isTele = /image\/(png|jpe?g)/.test(mime)
        let link = await uploadImage(media)
        try {
            let res = await RizzBardImg(text, link)
            await m.reply(res.content);
        } catch (e) {
            try {
                let res = await AemtBardImg(text, link)
                await m.reply(res);
            } catch (e) {
                await m.reply(eror);
            }
        }
    } else return m.reply("Use *bard (text)* or *bardimg (text/media)*")
}
handler.help = ["bard", "bardimg"]
handler.tags = ["ai"]
handler.command = /^(bard|bardimg)$/i

export default handler

/* New Line */
async function RizzBard(query) {
    return await bard.question({
        ask: query
    });
};

async function RizzBardImg(query, url) {
    return await bard.questionWithImage({
        ask: query,
        image: url
    });
};

async function AemtBard(query) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };

    const bardRes = await fetch(`https://aemt.me/bard?text=${query}`, {
        method: "get",
        headers
    });
    const bardText = await bardRes.json();
    return bardText.result;
};

async function AemtBardImg(query, url) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };

    const bardRes = await fetch(`https://aemt.me/bardimg?url=${url}&text=${query}`, {
        method: "get",
        headers
    });
    const bardText = await bardRes.json();
    return bardText.result;
};

async function GoogleBard(query) {
    try {
        const responseText = await gemini.question(query);
        return responseText.content;
    } catch (error) {
        console.error("An error occurred:", error.message);
        throw error;
    }
};