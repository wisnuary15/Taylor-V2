import cheerio from "cheerio";
import fetch from "node-fetch";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, text: text, command: command }) => {
  if (!text) return m.reply("Input query\nExample: .infoloker masak");
  m.react(wait);
  try {
    let teks = (await infoloker(text)).map(((item, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n📰 *Title:* ${item.job || "Tidak diketahui"}\n🏢 *Perusahaan:* ${item.perusahaan || "Tidak diketahui"}\n📍 *Daerah:* ${item.daerah || "Tidak diketahui"}\n🔗 *Link Detail:* ${item.link_Detail || "Tidak diketahui"}\n⬆️ *Upload:* ${item.upload || "Tidak diketahui"}\n`)).filter((v => v)).join("\n\n________________________\n\n");
    m.reply(teks);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["infoloker"], handler.tags = ["internet"], handler.command = /^(infoloker)$/i;
export default handler;
async function infoloker(query) {
  const url = `https://www.jobstreet.co.id/id/job-search/${query}-jobs/`,
    response = await fetch(url),
    html = await response.text(),
    $ = cheerio.load(html),
    format = [];
  return $("article").each(((a, article) => {
    const job = $(article).find("h1 a div").text(),
      perusahaan = $(article).find("span").eq(0).text(),
      daerah = $(article).find("span span").text(),
      link_Detail = "https://www.jobstreet.co.id" + $(article).find("h1 a").attr("href"),
      upload = $(article).find("div > time > span").text();
    format.push({
      job: job,
      perusahaan: perusahaan,
      daerah: daerah,
      upload: upload,
      link_Detail: link_Detail
    });
  })), format;
}