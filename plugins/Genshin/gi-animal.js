import genshindb from "genshin-db";
const handler = async (m, { conn: conn, text: text, args: args, usedPrefix: usedPrefix, command: command }) => {
  if (!text) throw `Example : *${usedPrefix + command} shiba*`;
  try {
    let anu = await genshindb.animals(text),
      ini_txt = `*Found : ${anu.name}*\n\n`;
    ini_txt += `"${anu.description}"\n\n`, ini_txt += `*Category :* ${anu.category}\n`,
      ini_txt += `*Count Type :* ${anu.counttype}\n`, ini_txt += `_sort order : ${anu.sortorder}_`,
      m.reply(ini_txt);
  } catch (e) {
    console.log(e);
    try {
      let anu2 = await genshindb.animals(`${text}`, {
        matchCategories: !0
      });
      m.reply(`*List ${text} categories :*\n\n- ` + anu2.toString().replaceAll(",", "\n- "));
    } catch (e) {
      console.log(e);
      let anu2 = await genshindb.animals("names", {
        matchCategories: !0
      });
      m.reply(`*Not Found*\n\n*Available animals is :*\n${anu2.join(", ")}`);
    }
  }
};
handler.help = ["gianimal <name>"], handler.tags = ["genshin"], handler.command = /^((gi|genshin)animals?)$/i,
  handler.limit = !0;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001);