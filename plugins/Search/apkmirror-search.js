import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  text
}) => {
  if (m.react(wait), !text) return m.reply("input query apkmirror?");
  try {
    let list = (await SearchApk(text)).map((item, index) => `\n\n*Title:* ${item.titles}\n*Url:* ${item.value}`).join("\n"),
      tops = `*${htki} 📺 Apk Search 🔎 ${htka}*`;
    m.reply(tops + list);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["apkms <query>"], handler.tags = ["internet"], handler.command = /^(apkms)$/i;
export default handler;
async function SearchApk(query) {
  const result = [];
  return await fetch("https://www.apkmirror.com/?s=" + query).then(response => response.text()).then(data => {
    const $ = cheerio.load(data);
    return $(".appRow").each((index, element) => {
      const link = $(element).find("a").attr("href"),
        titles = $(element).find("a").text();
      link.startsWith("/apk") && result.push({
        titles: titles.split("\n")[0],
        value: "https://www.apkmirror.com" + link.split("#")[0]
      });
    }), result;
  });
}