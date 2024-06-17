import axios from "axios";
import cheerio from "cheerio";
const handler = async (m, { conn: conn, isOwner: isOwner, usedPrefix: usedPrefix, command: command, args: args }) => {
  let text;
  if (args.length >= 1) text = args.slice(0).join(" ");
  else {
    if (!m.quoted || !m.quoted?.text) throw "input text\nEx. .persamaankata hello world\n<command> <tex>";
    text = m.quoted?.text;
  }
  try {
    m.react(wait);
    let res = await Persamaan_Kata(text);
    await conn.sendMessage(m.chat, {
      image: {
        url: res.image
      },
      caption: "*[ Result ]*\n\n" + ArrClean(res.result)
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["persamaankata"], handler.tags = ["search"], handler.command = /^(persamaankata|sinonim)$/i;
export default handler;

function ArrClean(str) {
  return str.map(((v, index) => ++index + ". " + v)).join("\r\n");
}
async function Persamaan_Kata(kata) {
  const html = await axios.get("https://m.persamaankata.com/search.php?q=" + kata),
    $ = cheerio.load(html.data),
    h = [];
  $("div.word_thesaurus > a").each((function(e, a) {
    h.push($(a).text());
  }));
  return {
    image: $("img#visual_synonym_img").attr("src"),
    result: h
  };
}