import fetch from "node-fetch";
import bo from "dhn-api";
const handler = async (m, {
  conn,
  usedPrefix,
  text,
  args,
  command
}) => {
  let lister = ["album", "article", "artist", "lyrics", "playlist", "song", "user"],
    [feature, querys] = text.split(/[^\w\s]/g);
  if (!lister.includes(feature)) return m.reply("*Example:*\n.kkbox api\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
  if (lister.includes(feature)) {
    if (!querys) return m.reply("Input Query!");
    m.react(wait);
    let data = await KKBOX(feature, querys);
    m.reply(`*${htki} 📺 KKBOX Search 🔎 ${htka}*\n${await formatData(data)}`);
  }
};
handler.help = ["kkbox"], handler.tags = ["fun"], handler.command = /^(kkbox)$/i;
export default handler;

function formatData(data) {
  let output = "";
  return data.forEach((item, index) => {
    output += `*[ Result ${index + 1} ]*\n`, Object.keys(item).forEach(key => {
      output += ` *${key}:* `, "object" == typeof item[key] ? Object.keys(item[key]).forEach(subKey => {
        output += `\n *${subKey}:* ${item[key][subKey]}`;
      }) : output += ` ${item[key]}\n`;
    });
  }), output;
}
async function _KKBOX(type, query) {
  let url = `https://api.kkbox.com/v1.1/search?q=${query}&territory=TW`,
    response = await fetch(url, {
      headers: {
        Authorization: "Bearer 9pYoKeM-L8ldglRUP5JGhg=="
      }
    });
  return (await response.json())[type].data;
}
async function KKBOX(type, query) {
  let url = "https://www.kkbox.com/api/search/" + type + "?q=" + query,
    response = await fetch(url);
  return (await response.json()).data.result;
}