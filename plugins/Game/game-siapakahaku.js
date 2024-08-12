import fetch from "node-fetch";
let timeout = 12e4,
  poin = 4999;
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
  let caption = `*${command.toUpperCase()}*\nSiapakah aku? ${json.soal}\nTimeout *${(timeout / 1e3).toFixed(2)} detik*\nKetik ${usedPrefix}hsi untuk bantuan\nBonus: ${poin} XP\n`.trim();
  conn.siapakahaku[id] = [await conn.sendFile(m.chat, imgr + command, "", caption, m), json, poin, setTimeout(async () => {
    conn.siapakahaku[id] && await conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0]),
      delete conn.siapakahaku[id];
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