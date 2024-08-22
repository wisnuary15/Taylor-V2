import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.caklontong = conn.caklontong ? conn.caklontong : {};
  let id = m.chat;
  if (id in conn.caklontong) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.caklontong[id][0]), !1;
  const json = await caklontong();
  let caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- ${json.soal}
*Clue:*
- ${"```" + json.jawaban.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.caklontong[id] = [await conn.reply(m.chat, caption, m, {
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
    conn.caklontong[id] && await conn.reply(m.chat, `*\`❌ TIMEOUT - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.jawaban}*`, conn.caklontong[id][0]), delete conn.caklontong[id];
  }, timeout)];
};
handler.help = ["caklontong"], handler.tags = ["game"], handler.command = /^caklontong/i;
export default handler;
const buttons = [
  ["Hint", "/hcak"],
  ["Nyerah", "menyerah"]
];
let caklontongjson;
async function caklontong() {
  if (!caklontongjson) {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/caklontong.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch caklontong data: ${response.statusText}`);
    }
    caklontongjson = await response.json();
  }
  const randomIndex = Math.floor(Math.random() * caklontongjson.length);
  return caklontongjson[randomIndex];
}