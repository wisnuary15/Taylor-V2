import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.tebaklirik = conn.tebaklirik ? conn.tebaklirik : {};
  let id = m.chat;
  if (id in conn.tebaklirik) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebaklirik[id][0]), !1;
  let res = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaklirik.json");
  if (!res.ok) return await `${res.status} ${res.statusText}`;
  let data = await res.json(),
    json = data[Math.floor(Math.random() * data.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.soal}
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebaklirik[id] = [await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: command.toUpperCase(),
        body: "",
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnailUrl: imgr + command,
        sourceUrl: ""
      }
    }
  }), json, poin, setTimeout(async () => {
    conn.tebaklirik[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.tebaklirik[id][0]), delete conn.tebaklirik[id];
  }, timeout)];
};
handler.help = ["tebaklirik"], handler.tags = ["game"], handler.command = /^tebaklirik/i;
export default handler;
const buttons = [
  ["Hint", "/hlir"],
  ["Nyerah", "menyerah"]
];