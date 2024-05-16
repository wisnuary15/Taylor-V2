import fetch from "node-fetch";
import crypto from "crypto";

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
        let res = await chatGPT(text)
        await m.reply(res)
    } catch (e) {
        await m.reply(eror)
    }
};
handler.help = ["cgptonline"];
handler.tags = ["gpt"];
handler.command = /^(cgptonline)$/i;

export default handler;

/* New Line */
async function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

async function chatGPT(msg) {
    const userId = await uuidv4();
    const formData = new FormData();
    formData.append('msg', msg);
    formData.append('user_id', userId);

    const result = await (await fetch('https://try.cgptonline.tech/send-message.php', {
        method: 'POST',
        body: formData
    })).json();

    const inputString = await (await fetch(`https://try.cgptonline.tech/index.php?chat_history_id=${result.id}&id=${userId}`)).text();

    return inputString
        .split('\n\n')
        .filter(data => data.includes('data: {"id":"chatcmpl'))
        .map(data => {
            try {
                return JSON.parse(data.match(/{.*}/)?.[0]);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return null;
            }
        })
        .filter(Boolean)
        .map(data => data.choices[0].delta.content)
        .join('');
}