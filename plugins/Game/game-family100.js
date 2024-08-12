import fetch from "node-fetch";
const winScore = 4999;
async function handler(m) {
  let imgr = flaaa.getRandom();
  this.familygame = this.familygame ? this.familygame : {};
  let id = "family100_" + m.chat;
  if (id in this.familygame) return await conn.reply(m.chat, "Masih ada kuis yang belum terjawab di chat ini", this.familygame[id].msg), !1;
  const json = await family100();
  let caption = `\n*Soal:* ${json.soal}\nTerdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(" ")) ? "\n(beberapa jawaban terdapat spasi)\n" : ""}\n+4999 XP tiap jawaban benar\n    `.trim();
  this.familygame[id] = {
    id: id,
    msg: await this.sendFile(m.chat, imgr + "Family100", "", caption, m),
    ...json,
    terjawab: Array.from(json.jawaban, () => !1),
    winScore: 4999
  };
}
handler.help = ["family100"], handler.tags = ["game"], handler.command = /^family100$/i;
export default handler;
let family100json;
async function family100() {
  if (!family100json) {
    const response = await fetch("https://raw.githubusercontent.com/BochilTeam/database/master/games/family100.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch family100 data: ${response.statusText}`);
    }
    family100json = await response.json();
  }
  const randomIndex = Math.floor(Math.random() * family100json.length);
  return family100json[randomIndex];
}