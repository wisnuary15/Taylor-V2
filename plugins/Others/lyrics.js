import {
  lyrics
} from "@bochilteam/scraper";
import fetch from "node-fetch";
import Genius from "genius-lyrics";
import axios from "axios";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || null;
  if (!text) throw "Masukkan judul musik!\n*Example:* .lirik hello";
  const Client = new Genius.Client("h6fTn1BYNjYi5VTszhyAFTcM3WWtk2E4hqrXCcutfObE4jVFnJ3LVyewHKIYTli7"),
    song = await Client.songs.search(text),
    nothing = "Tidak diketahui!";
  try {
    const bocil = await lyrics(text),
      bocap = `*乂 Judul 乂*\n${bocil.title || nothing}\n\n*乂 Lirik 乂*\n${bocil.lyrics || nothing}\n\n*乂 Penyanyi 乂*\n${bocil.author || nothing}\n\n*乂 Url 乂*\n${bocil.link || nothing}\n\n_By BochilTeam_`;
    m.reply(bocap);
  } catch (e) {
    try {
      const jenius = song[0],
        albert = `*乂 Judul 乂*\n${jenius.title || nothing}\n\n*乂 Lirik 乂*\n${await jenius.lyrics() || await getLyrics(jenius.url)}\n\n*乂 Penyanyi 乂*\n${(await jenius.artist).name || nothing}\n\n*乂 Url 乂*\n${jenius.url || nothing}\n\n_By Genius_`;
      m.reply(albert);
    } catch (e) {
      try {
        const frank = `*乂 Lirik 乂*\n${await getLyricsFreakLyrics(text)}\n\n_By lyricsfreak_`;
        m.reply(frank);
      } catch (e) {
        throw "Tidak dapat menemukan lirik!";
      }
    }
  }
};
handler.help = ["lirik"].map(v => v + " <judul>"), handler.tags = ["internet"],
  handler.command = /^l(irik(musik)?|yrics?)$/i;
export default handler;
async function getLyrics(url) {
  const response = await fetch(url),
    html = await response.text(),
    $ = cheerio.load(html);
  let lyrics = "";
  return $("div[class^=\"Lyrics__Container\"]").each((i, elem) => {
    if (0 !== $(elem).text().length) {
      const snippet = $(elem).html().replace(/<br>/g, "\n").replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
      lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
    }
  }), lyrics;
}
async function getLyricsFreakLyrics(songTitle) {
  try {
    const {
      data
    } = await axios.get(`https://www.lyricsfreak.com/search.php?a=search&q=${songTitle}`), songLink = cheerio.load(data)(".song").attr("href");
    if (!songLink) throw "Lirik tidak ditemukan di LyricsFreak";
    const songPage = await axios.get(`https://www.lyricsfreak.com${songLink}`),
      $$ = cheerio.load(songPage.data);
    return $$(".lyrictxt").text();
  } catch (error) {
    throw "Lirik tidak ditemukan di LyricsFreak";
  }
}