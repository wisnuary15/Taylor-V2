import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebaklogo = conn.tebaklogo ? conn.tebaklogo : {};
  let id = m.chat;
  if (id in conn.tebaklogo) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebaklogo[id][0]), !1;
  let res = await fetch("https://raw.githubusercontent.com/orderku/db/main/dbbot/game/tebakapp.json"),
    src = await res.json(),
    json = {
      hasil: src[Math.floor(Math.random() * src.length)]
    },
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Sebutkan nama logo ini.
*Clue:*
- ${"```" + json.hasil.data.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebaklogo[id] = [await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: command.toUpperCase(),
        body: "",
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: true,
        thumbnailUrl: json.hasil.data.image,
        sourceUrl: ""
      }
    }
  }), json, poin, setTimeout(async () => {
    conn.tebaklogo[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.hasil.data.jawaban}*`, conn.tebaklogo[id][0]), delete conn.tebaklogo[id];
  }, timeout)];
};
handler.help = ["tebaklogo"], handler.tags = ["game"], handler.command = /^tebaklogo/i;
export default handler;
const buttons = [
  ["Hint", "/hlog"],
  ["Nyerah", "menyerah"]
];