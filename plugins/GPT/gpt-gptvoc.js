import fetch from "node-fetch"
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
    let res = await ChatGpt(text)
    m.reply(res.content)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["gptvoc"]
handler.tags = ["gpt"];
handler.command = /^(gptvoc)$/i
export default handler
/* New Line */
const ChatGpt = async (prompt) => {
  const url = "https://apps.voc.ai/api/v1/plg/prompt_stream";
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt
      }),
    });
    const inputString = await response.text();
    const dataArray = inputString.split('\n\n');
    const regex = /data: (\{.*?\})/g;
    const jsonMatches = [];
    let match;
    while ((match = regex.exec(dataArray[0])) !== null) {
      jsonMatches.push(match[1]);
    }
    const oregex = /"data": ({.*?})/;
    const endsTrueArray = jsonMatches.slice(-1);
    const output = endsTrueArray[0]?.match(oregex);
    return output ? JSON.parse(output[1]) : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
