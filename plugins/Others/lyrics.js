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
  const nothing = "Tidak diketahui!";
  const Client = new Genius.Client("h6fTn1BYNjYi5VTszhyAFTcM3WWtk2E4hqrXCcutfObE4jVFnJ3LVyewHKIYTli7");
  const song = await Client.songs.search(text);
  let providerIndex = 0;
  let result = null;
  m.react(wait);
  while (providerIndex < 4 && !result) {
    try {
      switch (providerIndex) {
        case 0:
          const bocil = await lyrics(text);
          if (bocil.lyrics) {
            result = `*乂 Judul 乂*\n${bocil.title || nothing}\n\n*乂 Lirik 乂*\n${bocil.lyrics || nothing}\n\n*乂 Penyanyi 乂*\n${bocil.author || nothing}\n\n*乂 Url 乂*\n${bocil.link || nothing}\n\n_By BochilTeam_`;
          }
          break;
        case 1:
          const jenius = song[0];
          const jeniusLyrics = await jenius.lyrics() || await getLyrics(jenius.url);
          if (jeniusLyrics) {
            result = `*乂 Judul 乂*\n${jenius.title || nothing}\n\n*乂 Lirik 乂*\n${jeniusLyrics || nothing}\n\n*乂 Penyanyi 乂*\n${(await jenius.artist).name || nothing}\n\n*乂 Url 乂*\n${jenius.url || nothing}\n\n_By Genius_`;
          }
          break;
        case 2:
          const lyricsFreak = await getLyricsFreakLyrics(text);
          if (lyricsFreak) {
            result = `*乂 Lirik 乂*\n${lyricsFreak}\n\n_By lyricsfreak_`;
          }
          break;
        case 3:
          const limeResult = await searchLyrics(text);
          if (limeResult.status === "200" && limeResult.lyrics) {
            result = `*乂 Judul 乂*\n${limeResult.title || nothing}\n\n*乂 Lirik 乂*\n${limeResult.lyrics || nothing}\n\n*乂 Penyanyi 乂*\n${limeResult.artist || nothing}\n\n*乂 Url 乂*\n${limeResult.url || nothing}\n\n_By letra-lime_`;
          }
          break;
      }
    } catch (e) {
      providerIndex++;
    }
  }
  if (!result) {
    throw "Tidak dapat menemukan lirik!";
  } else {
    m.reply(result);
  }
};
handler.help = ["lirik"].map(v => v + " <judul>");
handler.tags = ["internet"];
handler.command = /^l(irik(musik)?|yrics?)$/i;
export default handler;
async function getLyrics(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  let lyrics = "";
  $('div[class^="Lyrics__Container"]').each((i, elem) => {
    if ($(elem).text().length !== 0) {
      const snippet = $(elem).html().replace(/<br>/g, "\n").replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
      lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
    }
  });
  return lyrics;
}
async function getLyricsFreakLyrics(songTitle) {
  try {
    const {
      data
    } = await axios.get(`https://www.lyricsfreak.com/search.php?a=search&q=${songTitle}`);
    const songLink = cheerio.load(data)(".song").attr("href");
    if (!songLink) throw "Lirik tidak ditemukan di LyricsFreak";
    const songPage = await axios.get(`https://www.lyricsfreak.com${songLink}`);
    const $$ = cheerio.load(songPage.data);
    return $$(".lyrictxt").text();
  } catch (error) {
    throw "Lirik tidak ditemukan di LyricsFreak";
  }
}
async function searchLyrics(term) {
  try {
    if (!term) {
      return "🟥 Provide the name of the song to search the lyrics";
    }
    const geniusResponse = await axios.get(`https://letra-lime.vercel.app/genius?query=${term}`);
    const geniusData = geniusResponse.data;
    if (!geniusData.length) {
      return `🟨 Couldn't find any lyrics for "${term}"`;
    }
    const lyricsUrl = geniusData[0]?.url;
    const lyricsResponse = await axios.get(`https://letra-lime.vercel.app/lyrics?url=${lyricsUrl}`);
    const result = {
      status: "200",
      creador: "letra-lime",
      title: geniusData[0]?.title || "",
      fullTitle: geniusData[0]?.fullTitle || "",
      artist: geniusData[0]?.artist.name || "",
      artistUrl: geniusData[0]?.artist.url || "",
      id: geniusData[0]?.id || "",
      enpoint: geniusData[0]?.endpoint || "",
      instrumental: geniusData[0]?.instrumental,
      image: geniusData[0]?.image || "",
      url: geniusData[0]?.url || "",
      lyrics: lyricsResponse.data.lyrics || ""
    };
    return result;
  } catch (error) {
    console.error(error);
    return {
      creador: "letra-lime",
      status: "error",
      message: new Error(error).message
    };
  }
}