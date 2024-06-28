import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  text
}) => {
  m.react(wait);
  if (!/\-release\//.test(text)) return m.reply("input link apkmirror\nakhiran *release* ?");
  try {
    let list = (await SearchApk(text)).map((item, index) => `\n\n*Url:* ${item.url}`).join("\n"),
      tops = `*${htki} 📺 Apk Search 🔎 ${htka}*`;
    m.reply(tops + list);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["apkms2 <query>"], handler.tags = ["nsfw"], handler.command = /^(apkms2)$/i;
export default handler;
async function SearchApk(query) {
  return await fetch(query).then(res => res.text()).then(html => {
    const $ = cheerio.load(html),
      links = [];
    return $("a[href$=\"download/\"]").each((i, link) => {
      const title = $(link).text(),
        url = $(link).attr("href");
      links.push({
        title: title,
        url: "https://www.apkmirror.com" + url
      });
    }), links;
  });
}