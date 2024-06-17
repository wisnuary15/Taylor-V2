import wibusoft from "wibusoft";
import fetch from "node-fetch";
const handler = async (m, { conn: conn, text: text }) => {
  if (!text) throw "Input Query";
  m.react(wait);
  try {
    const wallpaperURL = await fetchWallpaper(text);
    await conn.sendFile(m.chat, wallpaperURL, "Wallpaper Default", "Ini adalah wallpaper default.", m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["wallpaper"], handler.tags = ["tools"], handler.command = /^wall(paper)?q?$/i,
  handler.limit = !0;
export default handler;
async function fetchWallpaper(input) {
  const keywords = input.split(/[\W_]+/);
  let url;
  if ("desktop" !== keywords[keywords.length - 1].toLowerCase()) {
    const json = await wibusoft.anime.animeWallpaper(input);
    return json[Math.floor(Math.random() * json.length)];
  }
  url = "https://api.wer.plus/api/pcwal";
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch wallpaper.");
  const data = await response.json();
  if ("200" === data.code && data.data && data.data.img_url) return data.data.img_url;
  throw new Error("Invalid response data.");
}