import axios from "axios";
const handler = async (m, {
  conn,
  text
}) => {
  if (!text) return await conn.reply(m.chat, "Masukan Teksnya", m);
  axios.get(`https://some-random-api.com/binary?text=${text}`).then(async res => {
    let hasil = `Teks : ${text}\nBinary : ${res.data.binary}`;
    await conn.reply(m.chat, hasil, m);
  });
};
handler.help = ["binary"].map(v => v + " <teks>"), handler.tags = ["tools"],
  handler.command = /^(binary)$/i, handler.owner = !1, handler.exp = 0, handler.limit = !1;
export default handler;
