import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebakchara = conn.tebakchara ? conn.tebakchara : {};
  let id = m.chat;
  if (id in conn.tebakchara) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakchara[id][0]), !1;
  let res = await fetch("https://api.jikan.moe/v4/characters"),
    json = (await res.json()).data.getRandom(),
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Siapakah nama dari karakter ini?
*Clue:*
- ${"```" + json.name.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebakchara[id] = [await conn.sendFile(m.chat, json.images.jpg.image_url, "", caption, m), json, poin, setTimeout(async () => {
    conn.tebakchara[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.name}*\nKanji : ${json.name_kanji}\n*Url :* ${json.url}\n*Desk :* ${json.about}`, conn.tebakchara[id][0]),
      delete conn.tebakchara[id];
  }, timeout)];
};
handler.help = ["tebakchara"], handler.tags = ["game"], handler.command = /^tebakchara/i;
export default handler;
const buttons = [
  ["Hint", "/hcha"],
  ["Nyerah", "menyerah"]
];