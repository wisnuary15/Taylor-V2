import fetch from "node-fetch";
const handler = async (m, {
  conn,
  usedPrefix,
  text,
  args,
  command
}) => {
  if ("jooxp" === command) {
    if (!text) throw `Contoh:\n${usedPrefix + command} gustixa`;
    let f = await fetch(`https://api.lolhuman.xyz/api/jooxplay?apikey=${lolkey}&query=${text}`),
      x = await f.json(),
      teks = `*Result:*\n*singer:* ${x.result.info.singer}\n*song:* ${x.result.info.song}\n*album:* ${x.result.info.album}\n*date:* ${x.result.info.date}\n*duration:* ${x.result.info.duration}\n*duration:* ${x.result.lirik}\n`;
    await conn.sendFile(m.chat, x.result.image, "", teks, m), await conn.sendFile(m.chat, x.result.audio[0]?.link, "", "", m);
  }
};
handler.command = handler.help = ["jooxp"], handler.tags = ["tools"];
export default handler;
