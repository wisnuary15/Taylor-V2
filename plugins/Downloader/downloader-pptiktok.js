import fetch from "node-fetch";
const handler = async (m, { conn: conn, args: args, text: text }) => {
  if (!text) throw "*[❗INFO❗] Masukan Nama User Tiktok Yang Ingin Diambil Fotonya*";
  let res = `https://api.lolhuman.xyz/api/pptiktok/${text}?apikey=${lolkey}`;
  await conn.sendFile(m.chat, res, "error.jpg", `*[ ✔ ] Sukses Mengambil Foto User ${text}*`, m, !1);
};
handler.help = ["tiktokfoto"].map((v => v + " <user>")), handler.tags = ["downloader"],
  handler.command = /^(p((rofilet(iktok|t)|pt(iktok|t))|ptik)|t(ik(tokp(rofile|p)|pp)|tp(rofile|p)))$/i;
export default handler;