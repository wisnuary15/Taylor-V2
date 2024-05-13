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
        let data = await generateImage(text)
        if (data && data.imgs.length > 0) {
            for (let i = 0; i < data.imgs.length; i++) {
                await conn.sendFile(m.chat, data.imgs[i], '', `Image *(${i + 1}/${data.imgs.length})*`, m, false, {
                    mentions: [m.sender]
                });
            }
        }
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["gptpic"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(gptpic)$/i

export default handler

/* New Line */
async function generateImage(captionInput) {
    const data = {
        captionInput,
        captionModel: "default"
    };

    const url = 'https://chat-gpt.pictures/api/generateImage';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}