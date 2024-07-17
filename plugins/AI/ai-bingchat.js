import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  try {
    const data = await ChatGptBing(text);
    m.reply(data);
  } catch (error) {
    try {
      const data = await AemtBing(text);
      m.reply(data.result);
    } catch (error) {
      console.error(`Error in handler: ${error.message}`), m.reply("An error occurred while processing the request.");
    }
  }
};
handler.help = ["bingchat *[query]*"], handler.tags = ["ai"], handler.command = /^(bingchat)$/i;
export default handler;
async function ChatGptBing(prompt) {
  let response = await (await fetch("https://copilot.github1s.tk/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "dummy",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "Creative",
      max_tokens: 100,
      messages: [{
        role: "system",
        content: "Saya AI dari OpenAI, diciptakan untuk membantu Anda mengeksplorasi ide, bertukar informasi, dan menyelesaikan masalah. Ada yang bisa saya bantu?"
      }, {
        role: "user",
        content: prompt
      }]
    })
  })).json();
  return response.choices[0]?.message.content;
}
async function AemtBing(query) {
  const bardRes = await fetch(`https://aemt.me/bingai?text=${query}`, {
    method: "get",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
  return await bardRes.json();
}
