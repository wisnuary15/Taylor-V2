import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.tebakkimia = conn.tebakkimia ? conn.tebakkimia : {};
  let id = m.chat;
  if (id in conn.tebakkimia) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakkimia[id][0]), !1;
  let src = await (await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkimia.json")).json(),
    json = src[Math.floor(Math.random() * src.length)],
    caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Memiliki lambang \`${json.lambang}\` sebutkan nama unsur nya.
*Clue:*
- ${"```" + json.unsur.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hkim
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
  conn.tebakkimia[id] = [await conn.reply(m.chat, caption, m, {
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
    conn.tebakkimia[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.unsur}* | \`${json.lambang}\``, conn.tebakkimia[id][0]),
      delete conn.tebakkimia[id];
  }, timeout)];
};
handler.help = ["tebakkimia"], handler.tags = ["game"], handler.command = /^tebakkimia/i;
export default handler;
const buttons = [
  ["Hint", "/hkim"],
  ["Nyerah", "menyerah"]
];