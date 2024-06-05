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
        const result = await videodownloader(query);
        conn.reply(m.chat, JSON.stringify(result), m);
    } catch (error) {
        conn.reply(m.chat, error, m);
    }
};
handler.help = ["videodownloader *[link/query]*"];
handler.tags = ["downloader"];
handler.command = /^(videodownloader)$/i;
export default handler;
async function videodownloader(input) {
    const url = 'https://videodownloader.so/download?v=' + input;
    try {
        const response = await fetch(url);
        const $ = cheerio.load(await response.text());
        const info = $('.info .title').text().trim();
        const durationRaw = $('.duration').text().replace('Duration:', '').trim().split(':')?.map(Number);
        const durationFormatted = (durationRaw[2] + durationRaw[1] * 60 + durationRaw[0] * 3600) + ' detik';
        const videoInfo = $('#video-downloads .downloadsTable tbody tr')?.map((_, element) => {
            const qualityRaw = $(element).find('td:nth-child(1)').text().trim().split('x')?.map(part => part.trim())[0]?.replace(/^\d+$/, x => x + 'p');
            const format = $(element).find('td:nth-child(2)').text().trim().toLowerCase();
            const sizeRaw = $(element).find('td.size').text().trim().toLowerCase();
            const size = sizeRaw === '-' ? '-' : parseFloat(sizeRaw);
            const downloadLink = $(element).find('td a.downloadBtn').attr('href');
            return {
                quality: qualityRaw,
                format,
                size: size + ' MB',
                downloadLink
            };
        }).get();
        return {
            info,
            duration: durationFormatted,
            videoInfo
        };
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}
