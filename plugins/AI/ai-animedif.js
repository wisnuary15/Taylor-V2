import fetch from "node-fetch";
const handler = async (m, { conn: conn, isOwner: isOwner, usedPrefix: usedPrefix, command: command, args: args }) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed*`);
  m.react(wait);
  try {
    await conn.sendFile(m.chat, `https://api.xyroinee.xyz/api/ai/animediffusion?q=${text}&apikey=${xyro}`, "anu.jpg", `Prompt: ${text}`, m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["animedif"], handler.tags = ["ai"], handler.command = /^(animedif)$/i,
  handler.limit = !0;
export default handler;