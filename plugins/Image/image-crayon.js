import fetch from "node-fetch";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait);
    let res = await CraYon(text);
    const base64Data = ("data:image/webp;base64," + await pickRandom(res)).replace(/^data:image\/webp;base64,/, ""),
      buffer = Buffer.from(base64Data, "base64");
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: "*[ Result ]*\n" + text
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["crayon"], handler.tags = ["internet"], handler.command = /^crayon$/i;
export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
async function CraYon(query) {
  let res = await fetch(`https://corsproxy.io/?${encodeURIComponent`https://backend.craiyon.com/generate`}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: query
    })
  });
  return (await res.json()).images;
}