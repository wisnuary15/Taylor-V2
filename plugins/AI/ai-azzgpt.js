import fetch from "node-fetch";
const getazzgptResponse = async (q, u) => {
  try {
    const response = await fetch(`https://api.azz.biz.id/api/gpt?q=${q}&user=${u}&key=global`);
    return (await response.json()).respon;
  } catch (error) {
    return console.error(error), null;
  }
}, handler = async (m, {
  args
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau balas pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  try {
    const response = await getazzgptResponse(text, m.name);
    m.reply(response);
  } catch (error) {
    console.error("Error:", error), m.react(eror);
  }
};
handler.help = ["azzgpt"], handler.tags = ["ai"], handler.command = /^(azzgpt)$/i;
export default handler;
