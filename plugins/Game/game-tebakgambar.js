import fetch from "node-fetch";
import {
  webp2png
} from "../../lib/webp2mp4.js";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  conn.tebakingambar = conn.tebakingambar ? conn.tebakingambar : {};
  let id = m.chat;
  if (id in conn.tebakingambar) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakingambar[id][0]), !1;
  let json = await tebakgambar(),
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Rangkailah gambar ini menjadi satu kalimat.
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`,
    imgurl = await imageUrl(json.img);
  conn.tebakingambar[id] = [await conn.sendFile(m.chat, imgurl, "", caption, m), json, poin, setTimeout(async () => {
    conn.tebakingambar[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.tebakingambar[id][0]), delete conn.tebakingambar[id];
  }, timeout)];
};
handler.help = ["tebakgambar"], handler.tags = ["game"], handler.command = /^tebakgambar/i;
export default handler;
async function imageUrl(url) {
  try {
    let Blobs = await (await fetch(url)).blob(),
      arrayBuffer = await Blobs.arrayBuffer(),
      buffer = Buffer.from(arrayBuffer);
    return await webp2png(buffer);
  } catch (error) {
    console.error("Error:", error);
  }
}
const buttons = [
  ["Hint", "/hgam"],
  ["Nyerah", "menyerah"]
];
let tebakgambarjson;
async function tebakgambar() {
  if (!tebakgambarjson) {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakgambar.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch tebakgambar data: ${response.statusText}`);
    }
    tebakgambarjson = await response.json();
  }
  const randomIndex = Math.floor(Math.random() * tebakgambarjson.length);
  return tebakgambarjson[randomIndex];
}