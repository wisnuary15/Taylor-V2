import cheerio from 'cheerio';
import {
    fetch
} from 'undici';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const msg = `Input link atau reply link yang ingin di download!\n\n*Contoh:*\n${usedPrefix + command} link`;
    let text;
    if (args.length >= 1) {
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw msg;
    }
    conn.reply(m.chat, wait, m);
    const query = text.trim();
    try {
        const result = await chatgptdownloader(query);
        conn.reply(m.chat, JSON.stringify(result), m);
    } catch (error) {
        conn.reply(m.chat, error, m);
    }
};
handler.help = ["chatgptdownloader *[link/query]*"];
handler.tags = ["downloader"];
handler.command = /^(chatgptdownloader)$/i;
export default handler;
async function chatgptdownloader(inputUrl) {
    try {
        const response = await fetch('https://chatgptdownloader.com/wp-json/aio-dl/video-data/', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                url: inputUrl,
                token: "d869a16e9f14d2c03e9ce361e134e28bd87562b5ec071d88a7f4f04772b9b1ec"
            })
        });
        const data = await response.text();
        return JSON.parse(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}
