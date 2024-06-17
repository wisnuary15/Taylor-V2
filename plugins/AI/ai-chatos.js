import fetch from "node-fetch";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && (m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
  if (!text) return m.reply(`Masukkan teks atau balas pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    const messages = [{
        role: "system",
        content: "Saya AI dari OpenAI, diciptakan untuk membantu Anda mengeksplorasi ide, bertukar informasi, dan menyelesaikan masalah. Ada yang bisa saya bantu?"
      }, {
        role: "user",
        content: text
      }],
      output = await AichatOs(messages[0]?.content, messages[1].content);
    m.reply(output);
  } catch (e) {
    m.reply("Terjadi kesalahan.");
  }
};
handler.help = ["aichatos"], handler.tags = ["ai"], handler.command = /^(aichatos)$/i;
export default handler;
async function AichatOs(system, prompt) {
  try {
    const host = "api.aichatos.cloud",
      port = "443",
      requestOptions = {
        method: "POST",
        headers: {
          Authority: "p5.v50.ltd",
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Origin: "https://chat9.yqcloud.top",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
        },
        body: JSON.stringify({
          prompt: prompt,
          network: !0,
          system: system,
          withoutContext: !1,
          stream: !1
        })
      },
      response = await fetch(`https://${host}:${port}/api/generateStream`, requestOptions);
    return await response.text();
  } catch (e) {
    throw new Error("Error fetching data from AI service.");
  }
}