import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {};
  let id = m.chat;
  if (id in conn.siapakahaku) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.siapakahaku[id][0]), !1;
  const json = await siapakahaku();
  let caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.soal}
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.siapakahaku[id] = [await conn.reply(m.chat, caption, m, {
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
    conn.siapakahaku[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0]), delete conn.siapakahaku[id];
  }, timeout)];
};
handler.help = ["siapakahaku"], handler.tags = ["game"], handler.command = /^siapakahaku/i;
export default handler;
const buttons = [
  ["Hint", "/hsi"],
  ["Nyerah", "menyerah"]
];
let siapakahakujson;
async function siapakahaku() {
  if (!siapakahakujson) {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/siapakahaku.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch siapakahaku data: ${response.statusText}`);
    }
    siapakahakujson = await response.json();
  }
  const randomIndex = Math.floor(Math.random() * siapakahakujson.length);
  return siapakahakujson[randomIndex];
}