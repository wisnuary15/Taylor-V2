const handler = async (m, { args: args, usedPrefix: usedPrefix, command: command }) => {
  if (!args[0] && !args[1]) throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`;
  if (isNaN(args[0]) || isNaN(args[1])) throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`;
  let api = `https://api.lolhuman.xyz/api/quran/audio/args[0]/args[1]?apikey=${lolkey}`;
  await conn.sendFile(m.chat, api, "quran.mp3", null, m, !0, {
    type: "audioMessage",
    ptt: !0
  });
};
handler.help = ["ayta2"].map((v => v + " *surah no*")), handler.tags = ["islam"],
  handler.command = /^(ayat(mp32|audio2)|ayta2)$/i;
export default handler;