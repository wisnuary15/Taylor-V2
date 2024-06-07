import fetch from "node-fetch"
import cheerio from "cheerio"
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
    let res = await ComicvineSearch(text)
    let list = res.results.map((item, index) => `*${htki} SEARCH ${htka}*

*ID:* ${item.id}
*Name:* ${item.name}
*Deck:* ${item.deck}

`).join("\n")
    let res1 = await ComicvineCharacters()
    let list1 = res1.results.map((item, index) => `*${htki} CHARACTER ${htka}*

*ID:* ${item.id}
*Name:* ${item.name}
*Deck:* ${item.deck}
*Alias:* ${item.aliases}

`).join("\n")
    let res2 = await ComicvineVideos()
    let list2 = res2.results.map((item, index) => `*${htki} VIDEOS ${htka}*

*ID:* ${item.id}
*GUID:* ${item.guid}
*Name:* ${item.name}
*Hurl:* ${item.high_url}
*Deck:* ${item.deck}

`).join("\n")
    conn.sendFile(m.chat, res.results[0]?.image.original_url, "result", "\n" + list + "\n" + list1 + "\n" + list2,
      m)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["comicvine"]
handler.tags = ["search"]
handler.command = /^(comicvine)$/i
export default handler
async function ComicvineSearch(query) {
  const response = await fetch(
    "https://www.comicvine.com/api/search?format=json&field_list=name,id,deck,image&api_key=d800216c205879548fdc491e0a260ff402633c00&query=" +
    query);
  const data = await response.json();
  return data;
}
async function ComicvineCharacters() {
  const response = await fetch(
    "https://www.comicvine.com/api/characters?format=json&api_key=d800216c205879548fdc491e0a260ff402633c00");
  const data = await response.json();
  return data;
}
async function ComicvineVideos() {
  const response = await fetch(
    "https://www.comicvine.com/api/videos?format=json&api_key=d800216c205879548fdc491e0a260ff402633c00");
  const data = await response.json();
  return data;
}
