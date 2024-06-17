import cheerio from "cheerio";
import fetch from "node-fetch";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, text: text, command: command }) => {
  let lister = ["search", "app"],
    [feature, inputs, inputs_, inputs__, inputs___] = text.split("|");
  if (!lister.includes(feature)) return m.reply("*Example:*\n.apkcombo search|vpn\n\n*Pilih type yg ada*\n" + lister.map(((v, index) => "  ○ " + v)).join("\n"));
  if (lister.includes(feature)) {
    if ("search" === feature) {
      if (!inputs) return m.reply("Input query link\nExample: .apkcombo search|vpn");
      m.react(wait);
      try {
        let teks = (await searchApkcombo(inputs)).map(((item, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n🔗 *href:* ${item.href}\n📰 *title:* ${item.title}\n🖼️ *imgSrc:* ${item.imgSrc}\n👤 *name:* ${item.name}\n✍️ *author:* ${item.author}\n📝 *description:* ${item.description}`)).filter((v => v)).join("\n\n________________________\n\n");
        m.reply(teks);
      } catch (e) {
        m.react(eror);
      }
    }
    if ("app" === feature) {
      if (!inputs) return m.reply("Input query link\nExample: .apkcombo app|link");
      try {
        let resl = await getapkcombo(inputs),
          cap = "*Name:* " + resl.downloadLink + "\n*Link:* " + resl.downloadLinkURL + "\n\n" + wait;
        await conn.sendFile(m.chat, resl.ogImageUrl, "", cap, m), await conn.sendFile(m.chat, resl.downloadLinkURL, resl.downloadLink, null, m, !0, {
          quoted: m,
          mimetype: "application/vnd.android.package-archive"
        });
      } catch (e) {
        m.react(eror);
      }
    }
  }
};
handler.help = ["apkcombo"], handler.tags = ["internet"], handler.command = /^(apkcombo)$/i;
export default handler;
async function searchApkcombo(q) {
  const url = "https://apkcombo.com/id/search/" + q;
  try {
    const response = await fetch(url),
      html = await response.text(),
      $ = cheerio.load(html),
      results = [],
      contentApps = $(".content.content-apps");
    return contentApps.find("a.l_item").each(((index, element) => {
      const item = {
        href: $(element).attr("href"),
        title: $(element).attr("title"),
        imgSrc: $(element).find("img").attr("data-src"),
        name: $(element).find(".name").text(),
        author: $(element).find(".author").text(),
        description: $(element).find(".description").text()
      };
      results.push(item);
    })), results;
  } catch (error) {
    console.log(error);
  }
}