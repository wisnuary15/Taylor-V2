import cheerio from "cheerio";
import fetch from "node-fetch";
const handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  if (!text) return m.reply("Input query");
  m.react(wait);
  try {
    let teks = transformData(await scrapeData(text)).map((item, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n📰 *Title:* ${item.currentTitle} ( ${item.previousTitle} )\n🔗 *Url:* ${item.currentLink}`).filter(v => v).join("\n\n________________________\n\n");
    m.reply(teks);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["gcwa"].map(v => v + " <apa>"), handler.command = ["gcwa"],
  handler.tags = ["random"];
export default handler;

function transformData(data) {
  return data.map(({
    currentTitle,
    currentLink,
    previousTitle,
    previousLink
  }) => ({
    currentTitle: currentTitle.replace(/^\*\d+\.\s*/, "").replace(/\*/g, ""),
    currentLink: currentLink.split("?")[0],
    previousTitle: previousTitle.replace(/^(https:\/\/chat\.whatsapp\.com\/[^:]+):?/, "Sebelumnya: ").split("\n")[0],
    previousLink: previousLink.split("?")[0]
  }));
}
async function scrapeData(q) {
  try {
    const response = await fetch("http://ngarang.com/link-grup-wa/daftar-link-grup-wa.php?search=" + q + "&searchby=name"),
      html = await response.text(),
      $ = cheerio.load(html);
    return $(".wa-chat").map((index, element) => ({
      currentTitle: $(element).find(".wa-chat-body .wa-chat-title-container .wa-chat-title .wa-chat-title-text").text().trim(),
      currentLink: $(element).find(".wa-chat-body .wa-chat-title-container a").attr("href"),
      previousTitle: $(element).find(".wa-chat-body .wa-chat-message").text(),
      previousLink: $(element).find(".wa-chat-body .wa-chat-message .URLMessage").attr("href")
    })).get();
  } catch (error) {
    return console.log(error), null;
  }
}
