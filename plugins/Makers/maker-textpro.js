import fetch from 'node-fetch';
import cheerio from 'cheerio';
import {
    Maker
} from 'imagemaker.js';
const handler = async (m, {
    conn,
    args
}) => {
    try {
        const input = args.join(' ');
        if (!input) {
            return conn.reply(m.chat, `❌ Please provide the desired effect and order.\n\nUsage: *textpro effect|order|object1|object2*`, m);
        }
        const [effect, order, ...objects] = input.split('|');
        if (!order) {
            const searchResults = await searchTheme(effect);
            const itemsList = searchResults?.map((result, index) => `${index + 1}. ${result.title}`).join('\n');
            return conn.reply(m.chat, `❌ Please provide a valid order.\n\nAvailable options:\n${itemsList}\n\nUsage: *textpro effect|order|object1|object2*`, m);
        }
        const searchResults = await searchTheme(effect);
        if (isNaN(order) || order <= 0 || order > searchResults.length) {
            const itemsList = searchResults?.map((result, index) => `${index + 1}. ${result.title}`).join('\n');
            return conn.reply(m.chat, `❌ Invalid order format or order out of range. Please provide a valid order.\n\nAvailable options:\n${itemsList}\n\nUsage: *textpro effect|order|object1|object2*`, m);
        }
        const selectedResult = searchResults[order - 1];
        const maker = new Maker();
        const textproResult = await maker.TextPro(selectedResult.link, objects);
        const tag = `@${m.sender.split('@')[0]}`;
        await conn.sendMessage(m.chat, {
            image: {
                url: textproResult.imageUrl
            },
            caption: `Nih effect *${selectedResult.title}* nya\nRequest by: ${tag}`,
            mentions: [m.sender]
        }, {
            quoted: m
        });
    } catch (error) {
        conn.reply(m.chat, '❌ Error: ' + error.message, m);
    }
};
handler.help = ['textpro <effect> <text>'];
handler.tags = ['maker'];
handler.command = /^(textpro)$/i;
export default handler;
async function searchTheme(q) {
    const baseUrl = 'https://textpro.me';
    try {
        const response = await fetch(`${baseUrl}/search?q=${encodeURIComponent(q)}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        return $('.col-md-4')?.map((index, element) => ({
            link: `${baseUrl}${$(element).find('.div-effect a').attr('href') || ''}`,
            title: $(element).find('.title-effect-home').text() || ''
        })).get();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
