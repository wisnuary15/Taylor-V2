import fetch from "node-fetch"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    await m.reply(wait)
    try {
        let res = await chatWithGPT(text)
        await m.reply(res)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["resvai"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(resvai)$/i

export default handler

/* New Line */
async function chatWithGPT(your_qus) {
    const response = await fetch("https://tools.revesery.com/ai/ai.php?query=" + encodeURIComponent(your_qus), {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36"
        }
    });

    const data = await response.json();
    return data.result;
}