import fetch from "node-fetch";
const handler = async (m, {
  conn,
  text,
  args,
  usedPrefix,
  command
}) => {
  if (!text) throw `Example : ${usedPrefix + command} insulation potion`;
  let res = await fetch("https://api.genshin.dev/consumables/potions"),
    json = await res.json();
  if (null != json[`${text.replace(/ /g, "-")}`]) {
    let anu = json[`${text.replace(/ /g, "-")}`],
      ini_txt = `*Name : ${anu.name}*\n\n`;
    for (var x of (ini_txt += `Rarity : ${anu.rarity}\n`, ini_txt += `Effect : ${anu.effect}\n\n`, ini_txt += "*Crafting :*\n", anu.crafting)) ini_txt += `Item : ${x.item}\n`,
      ini_txt += `Quantity : ${x.quantity}\n`, ini_txt += "──────────\n\n";
    m.reply(ini_txt);
  } else {
    let ini_txt = `*Not Found*\n\n*Available potions is :*\n${Object.keys(json).toString().replace(/-/g, " ").replace(/,/g, ", ")}`;
    m.reply(ini_txt);
  }
};
handler.help = ["gipotion <teks>"], handler.tags = ["genshin"], handler.command = /^(gipotions?)$/i,
  handler.limit = !0;
export default handler;