import fetch from 'node-fetch';
import {
    FormData
} from 'formdata-node';

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
        let result = await gptGo(text)
        await m.reply(result)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["gptgo"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(gptgo)$/i
export default handler

/* New Line */
const gptGo = async (q) => {
    try {
        const formdata = new FormData();
        formdata.append("ask", q.toString());
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-language": "en-EN",
            "Origin": "https://gptgo.ai",
            "Referer": "https://gptgo.ai/",
            "sec-ch-ua": '"Google Chrome";v="116", "Chromium";v="116", "Not?A_Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        };
        const requestOptions = {
            method: "POST",
            headers,
            body: formdata,
            redirect: "follow",
        };

        const response = await fetch("https://gptgo.ai/get_token.php", requestOptions)
        const result = await response.text()
        const modifiedString = result.slice(0xa, -0x14);
        const token = atob(modifiedString);
        const response2 = await fetch(`https://api.gptgo.ai/web.php?array_chat=${token}`, requestOptions)
        const decodedData = await response2.text()
        const resultChat = decodedData
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => line.replace('data: ', ''))
            .slice(0, -2)
            .map(item => JSON.parse(item))
            .map(v => v.choices[0].delta.content)
            .join('');
        return resultChat;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};