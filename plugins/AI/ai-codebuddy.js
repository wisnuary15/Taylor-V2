import fetch from "node-fetch";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  args
}) => {
  const modelName = ["cleo", "ai", "ferdie"];
  const query = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!query) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  try {
    const models = modelName[Math.floor(Math.random() * modelName.length)];
    const openAIResponse = await CodeBuddy(query, models);
    if (openAIResponse) {
      await conn.sendMessage(m.chat, {
        text: openAIResponse
      }, {
        quoted: m
      });
    } else {
      console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
    }
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["codebuddy *[query]*"];
handler.tags = ["ai"];
handler.command = /^(codebuddy)$/i;
export default handler;
async function CodeBuddy(prompt, system) {
  const availableSystems = ["cleo", "ai", "ferdie"];
  try {
    if (!prompt) return "Input prompt tidak ada";
    if (!system || !availableSystems.includes(system)) return availableSystems;
    const response = await fetch("https://codebuddy-server.onrender.com/" + system, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        user: "You"
      })
    });
    return (await response.json()).msg;
  } catch (error) {
    console.log(error);
  }
}