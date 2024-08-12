import fetch from "node-fetch";
let timeout = 12e4,
  poin = 4999;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.tebakkata = conn.tebakkata ? conn.tebakkata : {};
  let id = m.chat;
  if (id in conn.tebakkata) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebakkata[id][0]), !1;
  const json = await tebakkata();
  let caption = `*${command.toUpperCase()}*\n${json.soal}\n\nTimeout *${(timeout / 1e3).toFixed(2)} detik*\nKetik ${usedPrefix}hkat untuk bantuan\nBonus: ${poin} XP\n    `.trim();
  conn.tebakkata[id] = [await conn.sendFile(m.chat, imgr + command, "", caption, m), json, poin, setTimeout(async () => {
    conn.tebakkata[id] && await conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkata[id][0]),
      delete conn.tebakkata[id];
  }, timeout)];
};
handler.help = ["tebakkata"], handler.tags = ["game"], handler.command = /^tebakkata/i;
export default handler;
const buttons = [
  ["Hint", "/hkat"],
  ["Nyerah", "menyerah"]
];
let tebakkatajson;
async function tebakkata() {
  if (!tebakkatajson) {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/tebakkata.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch tebakkata data: ${response.statusText}`);
    }
    tebakkatajson = await response.json();
  }
  const randomIndex = Math.floor(Math.random() * tebakkatajson.length);
  return tebakkatajson[randomIndex];
}