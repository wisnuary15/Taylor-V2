import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.tebaktebakan = conn.tebaktebakan ? conn.tebaktebakan : {};
  let id = m.chat;
  if (id in conn.tebaktebakan) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebaktebakan[id][0]), !1;
  let src = await (await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebaktebakan.json")).json(),
    json = src[Math.floor(Math.random() * src.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.soal}
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hteb
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebaktebakan[id] = [await conn.reply(m.chat, caption, m, {
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
    conn.tebaktebakan[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.tebaktebakan[id][0]), delete conn.tebaktebakan[id];
  }, timeout)];
};
handler.help = ["tebaktebakan"], handler.tags = ["game"], handler.command = /^tebaktebakan/i;
export default handler;
const buttons = [
  ["Hint", "/hteb"],
  ["Nyerah", "menyerah"]
];