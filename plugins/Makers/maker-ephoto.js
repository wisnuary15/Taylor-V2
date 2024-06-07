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
      return conn.reply(m.chat,
        `❌ Please provide the desired effect and order.\n\nUsage: *ephoto effect|order|object1|object2*`, m);
    }
    const [effect, order, ...objects] = input.split('|');
    if (!order) {
      const searchResults = await searchTheme(effect);
      const itemsList = searchResults.map((result, index) => `${index + 1}. ${result.title}`).join('\n');
      return conn.reply(m.chat,
        `❌ Please provide a valid order.\n\nAvailable options:\n${itemsList}\n\nUsage: *ephoto effect|order|object1|object2*`,
        m);
    }
    const searchResults = await searchTheme(effect);
    if (isNaN(order) || order <= 0 || order > searchResults.length) {
      const itemsList = searchResults.map((result, index) => `${index + 1}. ${result.title}`).join('\n');
      return conn.reply(m.chat,
        `❌ Invalid order format or order out of range. Please provide a valid order.\n\nAvailable options:\n${itemsList}\n\nUsage: *ephoto effect|order|object1|object2*`,
        m);
    }
    const selectedResult = searchResults[order - 1];
    const maker = new Maker();
    const ephotoResult = await maker.Ephoto360(selectedResult.link, objects);
    const tag = `@${m.sender.replace(/@.+/, '')}`;
    await conn.sendMessage(m.chat, {
      image: {
        url: ephotoResult.imageUrl
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
handler.help = ['ephoto'].map(v => v + ' <effect> <text>');
handler.tags = ['maker'];
handler.command = /^(ephoto)$/i;
export default handler;
async function searchTheme(q) {
  const baseUrl = 'https://en.ephoto360.com';
  try {
    const response = await fetch(`${baseUrl}/index/search?q=${encodeURIComponent(q)}`);
    const $ = cheerio.load(await response.text());
    return $('.col-md-4 .title-effect-home').map((index, element) => ({
      title: $(element).text() || '',
      link: `${baseUrl}${$(element).parent().attr('href') || ''}`
    })).get();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
