import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  m.react(wait)
  try {
    let result = await ToolbotAI(text)
    m.reply(result.result)
  } catch (e) {
    m.react(eror)
  }
};
handler.help = ["toolbot"];
handler.tags = ["gpt"];
handler.command = /^(toolbot)$/i;
export default handler;
/* New Line */
async function fetchData(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
async function ToolbotAI(desire) {
  try {
    const data = await fetchData("https://www.toolbot.ai/api/generate", {
      desire
    });
    const {
      description,
      prompt
    } = data.result[0];
    const data2 = await fetchData("https://www.toolbot.ai/api/query", {
      toolDescription: description,
      query: prompt,
    });
    return data2;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
