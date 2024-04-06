import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

let handler = async (m, {
    conn,
    text
}) => {
    try {
        if (!text) throw 'Input username!';
        await m.reply(wait);
        let res = await twitterStalk(text);
        let img = res?.pp_user;
        delete res.pp_user;
        let txt = Object.keys(res).map((v) => `*${v.capitalize()}:* ${res[v]}`).join`\n`;
        await conn.sendFile(m.chat, img, '', txt, m, null, {
            contextInfo: {
                mimetype: 'audio/mp4',
                externalAdReply: {
                    showAdAttribution: true,
                    mediaUrl: sig,
                    mediaType: 1,
                    description: wm,
                    title: wm,
                    body: botdate,
                    thumbnail: fs.readFileSync('./src/thumb.jpg'),
                    sourceUrl: sgc,
                },
            },
        });
    } catch (error) {
        console.error('Error:', error.message);
        m.reply(`Error: ${error.message}`);
    }
};
handler.help = ['twitterstalk'];
handler.tags = ['downloader'];
handler.command = /^(twitter|twt)stalk$/i;
handler.premium = true;

export default handler;

async function twitterStalk(user) {
    try {
        const res = await axios.get(`https://www.twuko.com/${user}/`);
        const $ = cheerio.load(res.data);
        const obj = {
            pp_user: $('div.relative.w-full.h-full.rounded-full.cursor-pointer.profile-image > img').text().trim() ?? null,
            name: $('div.p-3 > p.text-center.text-primary').text().trim(),
            username: $('div.p-3 > div > span.font-bold.text-center').text().trim(),
            followers: $('div.mb-4.text-4xl.font-bold.text-center').text().trim(),
            description: $('div.p-3.border-t.border-gray-200 > p').text().trim().replace(/\n/g, ''),
            ...Object.fromEntries(
                $('div.flex.justify-center > div.px-4').map((idx, el) => [
                    $(el).find('div.text-xs.font-bold.text-center.text-gray-600.uppercase').text().toLowerCase(),
                    $(el).find('div.text-xl.font-bold.text-center').text(),
                ])
            ),
        };
        return obj;
    } catch (error) {
        console.error('Error in twitterStalk:', error.message);
        throw error;
    }
}