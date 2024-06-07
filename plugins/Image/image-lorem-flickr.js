import fetch from "node-fetch";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  try {
    m.react(wait)
    var imge = await getFlickrImageURLByKeyword(text)
    conn.sendFile(m.chat, imge, "result", "*Result Flickr:*\n" + text.toUpperCase(), m)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["loremflickr"]
handler.tags = ["search"]
handler.command = /^(loremflickr)$/i
export default handler
const WIDTH = 339;
const HEIGHT = 500;
async function getFlickrImageURLByKeyword(keyword) {
  const url = `https://loremflickr.com/json/g/${WIDTH}/${HEIGHT}/${encodeURIComponent(
    keyword
  )}/all`;
  const response = await fetch(url);
  const json = await response.json();
  return json.file;
}
