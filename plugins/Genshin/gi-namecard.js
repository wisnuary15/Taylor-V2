import genshindb from "genshin-db";
const handler = async (m, {
  conn,
  text,
  args,
  usedPrefix,
  command
}) => {
  if (!text) throw `Example : *${usedPrefix + command} klee*`;
  try {
    let anu = await genshindb.namecards(text),
      ini_txt = `*${anu.name}*\n\n`;
    ini_txt += `*[ ${anu.description.replace("\n", " ]*\n_\"")}"_\n\n`, ini_txt += "" + (anu.source ? `*Source :* ${anu.source.toString().replaceAll(",", ", ")}` : ""),
      m.reply(ini_txt);
  } catch (e) {
    console.log(e);
    let anu2 = await genshindb.namecards("names", {
      matchCategories: !0
    });
    m.reply(`*Not Found*\n\n*Available namecards is :*\n${anu2.join(", ")}`);
  }
};
handler.help = ["ginamecard <item>"], handler.tags = ["genshin"], handler.command = /^((gi|genshin)(name)?cards?)$/i,
  handler.limit = !0;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001);
