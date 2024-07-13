import fetch from "node-fetch";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait), await Draw(text).then(async img => {
      await conn.sendFile(m.chat, img, text, "*[ Result ]*\n" + text, m);
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["openjourney"], handler.tags = ["misc"], handler.command = /^(openjourney)$/i;
export default handler;
async function Draw(propmt) {
  const Blobs = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney-v2", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer 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"
      },
      body: JSON.stringify({
        inputs: propmt
      })
    }).then(res => res.blob()),
    arrayBuffer = await Blobs.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
