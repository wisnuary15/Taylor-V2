import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, { conn: conn, text: text }) => {
  const query = text || m.quoted?.text || m.text;
  if (!query) return m.reply("Please provide text to stylize.");
  try {
    const message = (await stylizeText(query)).map((({ name: name, value: value }) => `*${name}*\n${value}`)).join("\n\n");
    await conn.reply(m.chat, message, m);
  } catch (error) {
    m.reply(`Error: ${error.message} ❌`);
  }
};
handler.help = ["style2 <text>"], handler.tags = ["tools"], handler.command = /^style(text)?2$/i,
  handler.exp = 0;
export default handler;
const stylizeText = async query => {
  try {
    const response = await fetch(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(query)}`),
      html = await response.text(),
      $ = cheerio.load(html);
    return $("table tr").map(((i, row) => {
      const cells = $(row).find("td");
      return cells.length > 1 ? {
        name: $(cells[0]).find(".aname").text() || $(cells[0]).text(),
        value: $(cells[1]).html().trim()
      } : null;
    })).get().filter(Boolean);
  } catch (error) {
    throw console.error("Error fetching data:", error), new Error("Failed to fetch and process data");
  }
};