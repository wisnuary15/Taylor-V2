import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.lengkapikalimat = conn.lengkapikalimat ? conn.lengkapikalimat : {};
  let id = m.chat;
  if (id in conn.lengkapikalimat) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.lengkapikalimat[id][0]), !1;
  let src = await (await fetch("https://raw.githubusercontent.com/qisyana/scrape/main/lengkapikalimat.json")).json(),
    json = src[Math.floor(Math.random() * src.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.pertanyaan}
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hlen
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.lengkapikalimat[id] = [await conn.sendFile(m.chat, imgr + command, "", caption, m), json, poin, setTimeout(async () => {
    conn.lengkapikalimat[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.lengkapikalimat[id][0]), delete conn.lengkapikalimat[id];
  }, timeout)];
};
handler.help = ["lengkapikalimat"], handler.tags = ["game"], handler.command = /^lengkapikalimat/i;
export default handler;
const buttons = [
  ["Hint", "/hlen"],
  ["Nyerah", "menyerah"]
];