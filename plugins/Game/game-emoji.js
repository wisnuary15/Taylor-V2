import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebakemoji = conn.tebakemoji ? conn.tebakemoji : {};
  let id = m.chat;
  if (id in conn.tebakemoji) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakemoji[id][0]), !1;
  let src = await (await fetch("https://emoji-api.com/emojis?access_key=b7e74af2d49675275c934455de1ef48fe8b6c0a3")).json(),
    json = src[Math.floor(Math.random() * src.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.character}
*Clue:*
- ${"```" + json.unicodeName.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hemo
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebakemoji[id] = [await conn.sendFile(m.chat, "https://emoji.aranja.com/static/emoji-data/img-apple-160/" + json.codePoint.toLowerCase() + ".png", "", caption, m), json, poin, setTimeout(async () => {
    conn.tebakemoji[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.unicodeName}*`, conn.tebakemoji[id][0]), delete conn.tebakemoji[id];
  }, timeout)];
};
handler.help = ["tebakemoji"], handler.tags = ["game"], handler.command = /^tebakemoji/i;
export default handler;
const buttons = [
  ["Hint", "/hemo"],
  ["Nyerah", "menyerah"]
];