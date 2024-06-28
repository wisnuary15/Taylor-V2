import cheerio from "cheerio";
import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  let lister = ["search", "app"],
    [feature, inputs, inputs_, inputs__, inputs___] = text.split("|");
  if (!lister.includes(feature)) return m.reply("*Example:*\n.uapkpro search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
  if (lister.includes(feature)) {
    if ("search" === feature) {
      if (!inputs) return m.reply("Input query link\nExample: .uapkpro search|vpn");
      m.react(wait);
      try {
        let teks = (await searchUapkpro(inputs)).map((item, index) => `🔍 *[ RESULT ${index + 1} ]*\n\n🔗 *Url:* ${item.url}\n📝 *Title:* ${item.title}\n📥 *Downloads:* ${item.downloadUrl}\n🏷️ *Category:* ${item.category}\n⭐ *Rating:* ${item.rating}\n`).filter(v => v).join("\n\n________________________\n\n");
        m.reply(teks);
      } catch (e) {
        m.react(eror);
      }
    }
    if ("app" === feature) {
      if (!inputs) return m.reply("Input query link\nExample: .uapkpro app|link");
      try {
        let resl = await getUapkpro(inputs),
          cap = "*Name:* " + resl.supportedAndroid + "\n*Link:* " + resl.downloadLink + "\n\n" + wait;
        await conn.sendFile(m.chat, resl.ogImageUrl, "", cap, m), await conn.sendFile(m.chat, resl.downloadLink, resl.supportedAndroid, null, m, !0, {
          quoted: m,
          mimetype: "application/vnd.android.package-archive"
        });
      } catch (e) {
        m.react(eror);
      }
    }
  }
};
handler.help = ["uapkpro"], handler.tags = ["internet"], handler.command = /^(uapkpro)$/i;
export default handler;
async function searchUapkpro(q) {
  const url = "https://uapk.pro/?s=" + q,
    response = await fetch(url),
    html = await response.text(),
    $ = cheerio.load(html),
    result = [];
  return $(".col-md-2.col-sm-4.col-xs-6").each((index, element) => {
    const obj = {
      title: $(element).find(".inner-box a[href]").text().trim(),
      url: $(element).find(".inner-box a[href]").attr("href"),
      category: $(element).find(".detail .sub-detail a").text().trim(),
      rating: $(element).find(".detail .display-rating").text().trim(),
      downloadUrl: $(element).find("a[href].anchor-hover").attr("href")
    };
    result.push(obj);
  }), result;
}
async function getUapkpro(url) {
  const response = await fetch(url),
    html = await response.text(),
    $ = cheerio.load(html),
    ogImageUrl = $("meta[property=\"og:image\"]").attr("content");
  return {
    supportedAndroid: $("p strong").text(),
    title: $("h1").text(),
    downloadLink: $("p a").attr("href"),
    ogImageUrl: ogImageUrl
  };
}