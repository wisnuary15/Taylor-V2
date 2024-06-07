import fetch from 'node-fetch';
import cheerio from 'cheerio';
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Input query. Example: ${usedPrefix + command} hello.`);
  try {
    const stylizedText = await stylizeText(text);
    const formattedText = stylizedText.map(({
      name,
      value
    }, index) => `🔢 *Nomor:* [${index + 1}]\n📛 *Nama:* ${name}\n📋 *Isi:* ${value}\n\n`).join('');
    conn.reply(m.chat,
      `📜 *Daftar Gaya* 📜\n\n${formattedText}🌟 Pilih gaya dengan menggunakan perintah *${usedPrefix + command} [teks]|[nomor]* 🌟`,
      m);
  } catch (error) {
    m.reply(`Error: ${error.message} ❌`);
  }
};
handler.help = ['font', 'styletext'].map(v => v + ' <text>');
handler.tags = ['tools'];
handler.command = /^(font|styletext)$/i;
handler.owner = false;
handler.limit = true;
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
