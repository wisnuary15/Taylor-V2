import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    
    try {
        const result = await gptc3(text);
        await m.reply(result);
    } catch (error) {
        await m.reply(error);
    }
}
handler.help = ["gptc3"]
handler.tags = ["ai", "gpt"];
handler.command = /^(gptc3)$/i
export default handler

async function gptc3(your_qus) {
    try {
        let linkaiList = [];
        let Baseurl = "https://c3.a0.chat/";
        linkaiList.push({
            content: your_qus,
            role: "user"
        });
        linkaiList.push({
            content: "Anda asisten AI, harap menggunakan bahasa Indonesia.",
            role: "system"
        });
        if (linkaiList.length > 10) linkaiList.shift();
        let response = await fetch(Baseurl + "v1/chat/gpt/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Forwarded-For": Array.from({
                    length: 4
                }, () => Math.floor(Math.random() * 256)).join('.'),
                "Referer": Baseurl + "#/web/chat",
                "accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify({
                list: linkaiList
            })
        });
        return await response.text();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}