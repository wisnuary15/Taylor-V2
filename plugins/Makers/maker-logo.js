import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    let query = "input text\nEx. .logo naruto\n<command> <text>";
    let text = args.length ? args.join(" ") : m.quoted && m.quoted.text ? m.quoted.text : null;

    if (!text) throw query;

    let [one, two] = text.split`|`;

    if (command === "logo") {
        let res = ["kaneki", "lolimaker", "girlneko", "rem", "sadboy"];
        let listSections = res.map((v, index) => [
            `                [ RESULT ${index + 1} ]`,
            [[v.toUpperCase(), `${usedPrefix}${command}get ${v}|${text}`, ""]]
        ]);
        return conn.sendList(
            m.chat, 
            `📺 Logo Maker 🔎`, 
            `⚡ Silakan pilih Model di tombol di bawah...\n*Teks yang anda kirim:* ${text}\n\nKetik ulang *${usedPrefix + command}* teks anda untuk mengubah teks lagi`, 
            author, 
            "☂️ M O D E L ☂️", 
            listSections, 
            m
        );
    }

    if (command === "logoget") {
        let url = getLogoUrl(one, two);
        await conn.sendFile(m.chat, url, 'logo.jpg', `Sudah Jadi`, m, false);
    }
};

handler.help = ['logo <text>'];
handler.tags = ['maker'];
handler.command = ["logo", "logoget"];

export default handler;

const getLogoUrl = (effect, text1, text2) => {
    const apiKey = 'caliphkey';
    const apiBase = 'https://api.caliph.biz.id/api';
    let endpoints = {
        kaneki: `${apiBase}/kaneki?nama=${text1}&apikey=${apiKey}`,
        lolimaker: `${apiBase}/lolimaker?nama=${text1}&nama2=${text2}&apikey=${apiKey}`,
        girlneko: `${apiBase}/girlneko?nama=${text1}&nama2=${text2}&apikey=${apiKey}`,
        rem: `${apiBase}/rem?nama=${text1}&apikey=${apiKey}`,
        sadboy: `${apiBase}/sadboy?nama=${text1}&nama2=${text2}&apikey=${apiKey}`
    };
    return endpoints[effect];
};
