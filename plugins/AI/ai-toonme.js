import axios from "axios";
const handler = async (m, {
  conn,
  args,
  usedPrefix
}) => {
  if (!args[0]) throw `Input *URL*\nklo mau pake gambar jadiin url dulu pake ${usedPrefix}tourl :v`;
  let imageURL = (await axios.get("https://xzn.wtf/api/aitoonme?url=" + args[0] + "&apikey=wudysoft")).data.url;
  m.reply("Sedang diproses..."), await conn.sendFile(m.chat, imageURL, "", wm, m);
};
handler.help = ["aitoonme"], handler.tags = ["convert"], handler.command = /^(aitoonme|tnm)$/i,
  handler.limit = !0;
export default handler;