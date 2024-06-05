import axios from 'axios';
import {
    load
} from 'cheerio';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const msg = `Input link atau reply link yang ingin di download!\n\n*Contoh:*\n${usedPrefix + command} link`;
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw msg;
    conn.reply(m.chat, wait, m);
    try {
        const data = await krakenFiles(text);
        const caption = Object.entries(data)?.map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join('\n');
        const result = !/\.\w+$/.test(data.title) ? `${data.title}.${data.type}` : data.title;
        conn.sendFile(m.chat, data.url, result, caption, m, false, {
            mentions: [m.sender]
        });
    } catch (error) {
        conn.reply(m.chat, eror, m);
    }
};
handler.help = ["kraken *[link]*"];
handler.tags = ["downloader"];
handler.command = /^(kraken)$/i;
export default handler;
async function krakenFiles(link) {
    try {
        const {
            data
        } = await axios.get(link);
        const $ = load(data);
        const result = {
            title: $('.coin-name h5').text().trim(),
            uploaddate: $('.nk-iv-wg4-overview li:nth-child(1) .lead-text').text().trim(),
            lastdownloaddate: $('.nk-iv-wg4-overview li:nth-child(2) .lead-text').text().trim(),
            filesize: $('.nk-iv-wg4-overview li:nth-child(3) .lead-text').text().trim(),
            type: $('.nk-iv-wg4-overview li:nth-child(4) .lead-text').text().trim(),
            views: $('.views-count').text().trim().slice(5),
            downloads: $('.downloads-count strong').text().trim(),
            fileHash: $('.general-information').attr('data-file-hash'),
        };
        const token = $('[id=dl-token]').attr('value');
        const hash = $('[data-file-hash]').first().attr('data-file-hash');
        const headers = {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
            'Cache-Control': 'no-cache',
            'hash': hash,
        };
        const payload = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="token"\r\n\r\n${token}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;
        const {
            data: json
        } = await axios.post(`https://krakenfiles.com/download/${hash}`, payload, {
            headers
        });
        json.url = json.url || `https:${$('#my-video source').attr('src')}`;
        return {
            ...result,
            ...json
        };
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};
