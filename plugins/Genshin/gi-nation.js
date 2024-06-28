import fetch from "node-fetch";
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) throw `Example : ${usedPrefix + command} liyue`;
  let res = await fetch(`https://api.genshin.dev/nations/${encodeURIComponent(text)}`),
    res2 = await fetch("https://api.genshin.dev/nations"),
    json = await res.json(),
    json2 = await res2.json();
  if (null != json.name) {
    let ini_txt = `*Name : ${json.name}*\n\n`;
    ini_txt += `*Element :* ${json.element}\n`, ini_txt += `*Archon :* ${json.element}\n`,
      ini_txt += `*ControllingEntity : ${json.controllingEntity}*`, m.reply(ini_txt);
  } else {
    let ini_txt = `*Not Found*\n\n*Available nations is :*\n${json2.join(", ")}`;
    m.reply(ini_txt);
  }
};
handler.help = ["gination <teks>"], handler.tags = ["genshin"], handler.command = /^((gi|genshin)nations?)$/i,
  handler.limit = !0;
export default handler;