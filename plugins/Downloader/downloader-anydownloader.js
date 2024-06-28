import cheerio from "cheerio";
import {
  fetch
} from "undici";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const msg = `Input link atau reply link yang ingin di download!\n\n*Contoh:*\n${usedPrefix + command} link`;
  let text;
  if (args.length >= 1) text = args.join(" ");
  else {
    if (!m.quoted || !m.quoted?.text) throw msg;
    text = m.quoted?.text;
  }
  m.react(wait);
  const query = text.trim();
  try {
    const result = await anydownloader(query);
    await conn.reply(m.chat, JSON.stringify(result), m);
  } catch (error) {
    await conn.reply(m.chat, error, m);
  }
};
handler.help = ["anydownloader *[link/query]*"], handler.tags = ["downloader"],
  handler.command = /^(anydownloader)$/i;
export default handler;
async function anydownloader(inputUrl) {
  try {
    const response = await fetch("https://anydownloader.com/wp-json/aio-dl/video-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          url: inputUrl,
          token: "d3113b033987d7debe39e8b117bc27b1afdf8f9c423723be3ffbe226767a6f76"
        })
      }),
      data = await response.text();
    return JSON.parse(data);
  } catch (error) {
    throw console.error("Error fetching data:", error), error;
  }
}