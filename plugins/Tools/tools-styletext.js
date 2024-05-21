import fetch from 'node-fetch';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    const query = text || m.quoted?.text || m.text;
    if (!query) return m.reply('Please provide text to stylize.');

    try {
        const styles = await stylizeText(query);
        const message = styles.map(({ name, value }) => `*${name}*\n${value}`).join('\n\n');
        await conn.reply(m.chat, message, m);
    } catch (error) {
        await m.reply(`Error: ${error.message} ❌`);
    }
};

handler.help = ['style2 <text>'];
handler.tags = ['tools'];
handler.command = /^style(text)?2$/i;
handler.exp = 0;

export default handler;

const stylizeText = async (query) => {
    try {
        const response = await fetch(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(query)}`);
        const html = await response.text();
        const $ = cheerio.load(html);

        return $('table tr').map((i, row) => {
            const cells = $(row).find('td');
            return cells.length > 1 ? {
                name: $(cells[0]).find('.aname').text() || $(cells[0]).text(),
                value: $(cells[1]).html().trim()
            } : null;
        }).get().filter(Boolean);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch and process data');
    }
};
