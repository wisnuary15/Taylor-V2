import fetch from "node-fetch";
const handler = async (m, { conn: conn, usedPrefix: usedPrefix, text: text, args: args, command: command }) => {
  if (!text) throw `Contoh penggunaan ${usedPrefix}${command} query`;
  await conn.sendFile(m.chat, `https://api.lolhuman.xyz/api/random2/${text}?apikey=${lolkey}`, "", `Random *${command}*`, m);
};
handler.command = /^(dlrandom2)$/i;
export default handler;