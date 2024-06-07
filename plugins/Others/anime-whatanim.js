import uploadImage from "../../lib/uploadImage.js";
import fetch from "node-fetch";
import * as fs from "fs";
const fetchAnimeInfo = async (url) => {
  const res = await fetch(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(url)}`);
  return res.json();
};
const handler = async (m, {
  conn,
  usedPrefix
}) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || "";
  if (!mime) throw "Fotonya?";
  if (!/image\/(jpe?g|png)/.test(mime)) throw `Mime ${mime} tidak support`;
  const img = await q?.download();
  const upld = await uploadImage(img);
  m.react(wait);
  try {
    const json = await fetchAnimeInfo(upld);
    const {
      title,
      synonyms,
      isAdult
    } = json.result[0]?.anilist;
    const {
      episode,
      similarity,
      image
    } = json.result[0];
    const result =
      `*Title :* ${title.romaji} (${title.native})\n*Synonyms :* ${synonyms.join(", ")}\n*Adult :* ${isAdult}\n*Similarity :* ${(similarity * 100).toFixed(1)}%\n*Episode :* ${episode}`;
    conn.sendFile(m.chat, image, "wait.jpg", result, m);
  } catch (e) {
    throw "Error: Could not retrieve anime information.";
  }
};
handler.help = ["whatanime"];
handler.tags = ["anime"];
handler.command = /^(wait|whatanime|source)$/i;
handler.limit = true;
export default handler;
