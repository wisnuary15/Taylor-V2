import fetch from "node-fetch";
const handler = async (m, {
  conn,
  command,
  text
}) => {
  let imgr = flaaa.getRandom();
  if (/help/.test(text)) return m.reply("\n┌「 *Sambung Kata* 」\n├ Sambung Kata adalah\n│ permainan yang dimana setiap\n│ pemainnya diharuskan membuat\n│ kata dari akhir kata yang\n│ berasal dari kata sebelumnya.\n└────\n┌「 *Peraturan* 」\n├ Jawaban kata tidak mengandung\n│ spasi dan imbuhan (me-, -an, dll).\n├ .skata\n│ untuk memulai\n├ ketik *nyerah*\n│ untuk menyerah\n├ berhasil menjawab\n│ mendapatkan 100 XP\n└────".trim());
  conn.skata = conn.skata ? conn.skata : {};
  let id = m.chat;
  if (!text) return m.reply("input kata awal");
  let res = await fetch("https://api.lolhuman.xyz/api/sambungkata?apikey=" + lolkey + "&text=" + text),
    json = await res.json();
  if (id in conn.skata) return await conn.reply(m.chat, "^ soal ini belum terjawab!", conn.skata[id][0]);
  let kata = json.result;
  conn.skata[id] = [await conn.sendFile(m.chat, imgr + command, "", "*Mulai dari kata:* " + kata.toUpperCase() + "\n\n*Awalan:* " + kata.toUpperCase().slice(-1).toUpperCase() + "... ?\n\n*balas pesan ini untuk menjawab!*", m), kata.toLowerCase(), []];
};
handler.help = ["sambungkata [help]"], handler.tags = ["game"], handler.command = /^s(ambung)?kata$/i,
  handler.limit = !0;
export default handler;
