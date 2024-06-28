import fetch from "node-fetch";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed*`);
  m.react(wait);
  try {
    await conn.sendFile(m.chat, `https://api.xyroinee.xyz/api/ai/stablediffusion?q=${encodeURIComponent(text)}&apikey=${xyro}`, "anu.jpg", `Prompt: ${text}`, m);
  } catch (e) {
    console.error(e), m.react(eror);
  }
};
handler.help = ["stabledif"], handler.tags = ["ai"], handler.command = /^(stabledif)$/i,
  handler.limit = !0;
export default handler;