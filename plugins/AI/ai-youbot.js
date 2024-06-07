import fetch from 'node-fetch';
const getyoubotResponse = async (q, u) => {
  try {
    const response = await fetch(`https://api.azz.biz.id/api/youbot?q=${q}&key=global`);
    const data = await response.json();
    return data.hasil;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan: \n * ${usedPrefix}${command}Hai, apa kabar ? *`
    );
  m.react(wait);
  try {
    const response = await getyoubotResponse(text, m.name);
    m.reply(response);
  } catch (error) {
    console.error('Error:', error);
    m.react(eror);
  }
};
handler.help = ['youbot'];
handler.tags = ['ai'];
handler.command = /^(youbot)$/i;
export default handler;
