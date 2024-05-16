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
        let res = await getFormattedRideInfo(text)
        await m.reply(res.choices[0].message.content)
    } catch (e) {
        throw eror
    }
}
handler.help = ["chatgptonline"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^chatgptonline$/i

export default handler

/* New Line */
async function getFormattedRideInfo(message) {
    const apiUrl = 'https://openai.api2d.net/v1/chat/completions'
    const headers = {
        Authorization: 'Bearer fk186009-gCYVPTkf6aMycD4o2ZM9fRsDwp52ONdz|ck43-632713d', // <-- Replace fkxxxxx with your own Forward Key, make sure to keep 'Bearer ' and have a space in between.
        'Content-Type': 'application/json',
    }

    const payload = {
        messages: [{
            content: message,
            role: 'user'
        }],
        model: 'gpt-3.5-turbo',
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return undefined;
    }
}