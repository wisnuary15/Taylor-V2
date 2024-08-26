import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  flaaa.getRandom();
  conn.tebakgame = conn.tebakgame ? conn.tebakgame : {};
  let id = m.chat;
  if (id in conn.tebakgame) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakgame[id][0]), !1;
  let src = await (await fetch("https://raw.githubusercontent.com/qisyana/scrape/main/tebakgame.json")).json(),
    json = src[Math.floor(Math.random() * src.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Apakah nama logo ini.
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebakgame[id] = [await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: command.toUpperCase(),
        body: "",
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnailUrl: json.img,
        sourceUrl: ""
      }
    }
  }), json, poin, setTimeout(async () => {
    conn.tebakgame[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.tebakgame[id][0]), delete conn.tebakgame[id];
  }, timeout)];
};
handler.help = ["tebakgame"], handler.tags = ["game"], handler.command = /^tebakgame/i;
export default handler;
const buttons = [
  ["Hint", "/hgame"],
  ["Nyerah", "menyerah"]
];