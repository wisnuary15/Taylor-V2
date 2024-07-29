import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  try {
    let res = await fetch(`https://api.lolhuman.xyz/api/neonimelatest?apikey=${lolkey}`),
      get_result = await res.json(),
      ini_txt = "*Latest Anime :*";
    for (let x of get_result.result) ini_txt += `\n\n*${x.title}*\n`, ini_txt += `Episode : ${x.episode}\n`,
      ini_txt += `Date : ${x.episode}\n`, ini_txt += `Link : ${x.link}\n\n`, ini_txt += `_"${x.desc}"_\n`,
      ini_txt += "───────────────────";
    await conn.sendMessage(m.chat, {
      image: {
        url: get_result.result[0]?.thumbnail
      },
      caption: ini_txt
    }, {
      quoted: m
    });
  } catch (e) {
    console.log(e), m.reply("Tidak ditemukan hasil.");
  }
};
handler.menu = ["neonimelatest"], handler.tags = ["search"], handler.command = /^(neonime( latest|latest)?)$/i,
  handler.premium = !0, handler.limit = !0;
export default handler;
