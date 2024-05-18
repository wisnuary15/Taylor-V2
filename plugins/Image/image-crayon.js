import fetch from "node-fetch"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    try {
        await m.reply(wait)
        let res = await CraYon(text)
        const base64Image = "data:image/webp;base64," + await pickRandom(res);
        const base64Data = base64Image.replace(/^data:image\/webp;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: "*[ Result ]*\n" + text
        }, {
            quoted: m
        })

    } catch (e) {
        throw eror
    }
}
handler.help = ["crayon"]
handler.tags = ["internet"]
handler.command = /^crayon$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
/* New Line */
async function CraYon(query) {
    let proxyurl = "https://corsproxy.io/?";
    let res = await fetch(
        `${proxyurl}${encodeURIComponent`https://backend.craiyon.com/generate`}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: query,
            }),
        }
    )
    let json = await res.json()
    return json.images
}