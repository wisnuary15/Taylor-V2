import cheerio from "cheerio";
import fetch from "node-fetch";
const handler = async (m, { conn: conn, usedPrefix: usedPrefix, text: text, args: args, command: command }) => {
  try {
    if (text.match(/(https:\/\/sfile.mobi\/)/gi)) {
      let res = await sfileDl(text);
      if (!res) throw "Error :/";
      let caption = `- *[ RESULT ]*\n\n- *Name:* ${res.name}\n- *Author:* ${res.author}\n- *Mimetype:* ${res.mimeType}\n- *Description:* ${res.description}\n`;
      m.reply(caption + "\n\n" + wait);
      const { data: data } = await conn.getFile(res.downloadLink);
      await conn.sendMessage(m.chat, {
        document: data,
        fileName: res.name,
        mimetype: res.mimeType
      }, {
        quoted: m
      });
    } else {
      if (!text) throw "Input Query / Sfile Url!";
      {
        let [query, page] = text.split("|"), res = await sfileSearch(query, page);
        if (!res.result.length) throw `Query "${text}" not found :/`;
        let teks = res.result.map(((v, index) => `- *[ RESULT ${index + 1} ]*\n\n- *Name:* ${v.name}\n- *Size:* ${v.size}\n- *Link:* ${v.link}`)).filter((v => v)).join("\n\n________________________\n\n");
        m.reply(teks + "\n*Total:*" + res.total);
      }
    }
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["sfile"], handler.tags = ["downloader"], handler.command = /^sfile(d(own(load)?|l))?$/i;
export default handler;
async function sfileSearch(query, page = 1) {
  try {
    const response = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`),
      html = await response.text(),
      $ = cheerio.load(html),
      result = $(".list").map(((index, element) => {
        const text = $(element).text(),
          nameMatch = $(element).find("a").text(),
          link = $(element).find("a").attr("href"),
          sizeMatch = text.match(/\((.*?)\)/);
        return {
          name: nameMatch,
          link: link,
          size: sizeMatch ? sizeMatch[1] : ""
        };
      })).get().filter((item => item.name));
    return {
      total: result.length,
      result: result
    };
  } catch (error) {
    throw error;
  }
}
async function sfileDl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch the URL: ${response.statusText}`);
    const html = await response.text(),
      $ = cheerio.load(html),
      match = /'(\w{32})';/.exec($("a#download").attr("onclick"));
    if (!match) throw new Error("Download parameter not found in the onclick attribute");
    const downloadLink = $(".w3-center #download").attr("href") || "",
      mimeType = $(".list svg.icon-file-code-o").parent().text().slice(2).trim();
    return {
      mimeType: mimeType,
      name: $("h1.intro").text().trim(),
      author: $("svg.icon-user-o").next().text().trim(),
      description: $(".list:last").text().trim(),
      downloadLink: downloadLink + "&k=" + match[1]
    };
  } catch (error) {
    throw error;
  }
}