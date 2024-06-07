import fetch from "node-fetch";
const handler = async (m, {
  conn,
  usedPrefix,
  args,
  command
}) => {
  try {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
      .quoted?.description) || null;
    if (!text) return m.reply(
      `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
      );
    let quote = await createQuote(m.name, text);
    conn.sendFile(m.chat, quote, '', `*Request by:*\n${m.name}`, m);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
handler.tags = ["search"];
handler.command = handler.help = ["quozio"];
export default handler;
async function createQuote(author, message) {
  try {
    const host = "https://quozio.com/";
    const quote = await fetch(`${host}api/v1/quotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author,
        quote: message
      }),
    }).then(res => res.json());
    const quoteId = quote.quoteId;
    const templates = await fetch(`${host}api/v1/templates`).then(res => res.json()).then(data => data.data);
    const template = templates[Math.floor(Math.random() * templates.length)];
    const imageUrl = await fetch(`${host}api/v1/quotes/${quoteId}/imageUrls?templateId=${template.templateId}`).then(
      res => res.json()).then(data => data.medium);
    return imageUrl;
  } catch (err) {
    console.error("Error creating quote:", err);
    throw err;
  }
}
