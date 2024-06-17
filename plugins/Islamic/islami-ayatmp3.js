import { alquran } from "@bochilteam/scraper";
const handler = async (m, { args: args, usedPrefix: usedPrefix, command: command }) => {
  if (!args[0] && !args[1]) throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`;
  if (isNaN(args[0]) || isNaN(args[1])) throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`;
  let api = await alquran(),
    mes = `\n${api[args[0] - 1].ayahs[args[1] - 1].text.ar}\n    \n${api[args[0] - 1].ayahs[args[1] - 1].translation.id}\n( Q.S ${api[args[0] - 1].asma.id.short} : ${api[args[0] - 1].ayahs[args[1] - 1].number.insurah} )\n`.trim();
  m.reply(mes), await conn.sendFile(m.chat, api[args[0] - 1].ayahs[args[1] - 1].audio.url, "", "", m);
};
handler.help = ["ayta"].map((v => v + " *surah no*")), handler.tags = ["islam"],
  handler.command = /^(ayat(mp3|audio)|ayta)$/i;
export default handler;