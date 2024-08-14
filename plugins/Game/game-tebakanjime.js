import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebakanjime = conn.tebakanjime ? conn.tebakanjime : {};
  let id = m.chat;
  if (id in conn.tebakanjime) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakanjime[id][0]), !1;
  let res = await fetch("https://api.jikan.moe/v4/random/characters"),
    json = (await res.json()).data,
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Siapakah nama dari karakter ini?
*Clue:*
- ${"```" + json.name.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hani
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebakanjime[id] = [await conn.sendFile(m.chat, json.images.jpg.image_url, "", caption, m), json, poin, setTimeout(async () => {
    conn.tebakanjime[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.name}*\n*Desk:* ${json.name_kanji}\n${json.about}`, conn.tebakanjime[id][0]),
      delete conn.tebakanjime[id];
  }, timeout)];
};
handler.help = ["tebakanime"], handler.tags = ["game"], handler.command = /^tebakanime/i;
export default handler;
const buttons = [
  ["Hint", "/hani"],
  ["Nyerah", "menyerah"]
];