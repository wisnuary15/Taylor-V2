import {
  lyrics
} from "@bochilteam/scraper";
import fetch from "node-fetch";
import Genius from "genius-lyrics";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args
}) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || null;
  if (!text) return m.reply("⚠️ *Masukkan judul musik!*\nContoh: `.lirik hello`");
  const nothing = "⚪ *Tidak diketahui!*";
  const Client = new Genius.Client("h6fTn1BYNjYi5VTszhyAFTcM3WWtk2E4hqrXCcutfObE4jVFnJ3LVyewHKIYTli7");
  const song = await Client.songs.search(text);
  let result = null;
  m.react(wait);
  const providers = [async () => {
    try {
      const bocil = await lyrics(text);
      return bocil.lyrics ? `*🎵 Judul:*\n${bocil.title || nothing}\n\n*📝 Lirik:*\n${bocil.lyrics.replace(/\n/g, "\n") || nothing}\n\n*🎤 Penyanyi:*\n${bocil.author || nothing}\n\n*🔗 URL:*\n${bocil.link || nothing}\n\n_By BochilTeam_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const jenius = song[0];
      const jeniusLyrics = await jenius.lyrics() || await getLyrics(jenius.url);
      return jeniusLyrics ? `*🎵 Judul:*\n${jenius.title || nothing}\n\n*📝 Lirik:*\n${jeniusLyrics.replace(/\n/g, "\n") || nothing}\n\n*🎤 Penyanyi:*\n${(await jenius.artist).name || nothing}\n\n*🔗 URL:*\n${jenius.url || nothing}\n\n_By Genius_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const response = await fetch(`${Object.entries(APIs).find(([ key ]) => key.includes("proxy"))?.[1]}https://genius.com/api/search/lyrics?q=${encodeURIComponent(text)}`);
      const data = await response.json();
      const path = data?.response?.sections[0]?.hits[0]?.result?.path;
      const lyricsFromPath = await getLyrics(`https://genius.com${path}`);
      return lyricsFromPath ? `*📝 Lirik:*\n${lyricsFromPath.replace(/\n/g, "\n")}\n\n_By Genius API_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const apiTextyl = await getLyricsTextyl(text);
      return apiTextyl ? `*📝 Lirik:*\n${apiTextyl.replace(/\n/g, "\n")}\n\n_By Textyl API_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const globalApi = await getLyricsGlobalApi(text);
      return globalApi ? `*📝 Lirik:*\n${globalApi.replace(/\n/g, "\n")}\n\n_By Global API_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const notApi = await getLyricsNotApi(text);
      return notApi ? `*🎵 Judul:*\n${notApi.title || nothing}\n\n*📝 Lirik:*\n${notApi.lyrics.replace(/\n/g, "\n") || nothing}\n\n*🎤 Penyanyi:*\n${notApi.artist || nothing}\n\n*🔗 URL:*\n${notApi.url || nothing}\n\n_By Not API_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const kingAryanApi = await getLyricsKingAryanApi(text);
      return kingAryanApi ? `*📝 Lirik:*\n${kingAryanApi.replace(/\n/g, "\n")}\n\n_By King Aryan API_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const lyricsFreak = await getLyricsFreakLyrics(text);
      return lyricsFreak ? `*📝 Lirik:*\n${lyricsFreak.replace(/\n/g, "\n")}\n\n_By LyricsFreak_` : null;
    } catch {
      return null;
    }
  }, async () => {
    try {
      const limeResult = await searchLyrics(text);
      return limeResult.status === "200" && limeResult.lyrics ? `*🎵 Judul:*\n${limeResult.title || nothing}\n\n*📝 Lirik:*\n${limeResult.lyrics.replace(/\n/g, "\n") || nothing}\n\n*🎤 Penyanyi:*\n${limeResult.artist || nothing}\n\n*🔗 URL:*\n${limeResult.url || nothing}\n\n_By Letra-Lime_` : null;
    } catch {
      return null;
    }
  }];
  for (let provider of providers) {
    result = await provider();
    if (result) break;
  }
  result ? m.reply(result) : m.reply("❌ *Tidak dapat menemukan lirik!*");
};
handler.help = ["lirik"].map(v => v + " <judul>");
handler.tags = ["internet"];
handler.command = /^l(irik(musik)?|yrics?)$/i;
export default handler;
async function getLyrics(url) {
  try {
    const response = await fetch(Object.entries(APIs).find(([key]) => key.includes("proxy"))?.[1] + url);
    const html = await response.text();
    const $ = cheerio.load(html);
    let lyrics = "";
    $('div[class^="Lyrics__Container"]').each((i, elem) => {
      if ($(elem).text().length) {
        const snippet = $(elem).html().replace(/<br>/g, "\n").replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
        lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
      }
    });
    return lyrics;
  } catch {
    return null;
  }
}
async function getLyricsFreakLyrics(songTitle) {
  try {
    const response = await fetch(`https://www.lyricsfreak.com/search.php?a=search&q=${songTitle}`);
    const data = await response.text();
    const songLink = cheerio.load(data)(".song").attr("href");
    if (!songLink) return null;
    const songPage = await fetch(`https://www.lyricsfreak.com${songLink}`);
    const songData = await songPage.text();
    const $$ = cheerio.load(songData);
    return $$(".lyrictxt").text();
  } catch {
    return null;
  }
}
async function searchLyrics(term) {
  try {
    if (!term) return null;
    const response = await fetch(`https://letra-lime.vercel.app/genius?query=${term}`);
    const geniusData = await response.json();
    if (!geniusData.length) return null;
    const lyricsResponse = await fetch(`https://letra-lime.vercel.app/lyrics?url=${geniusData[0]?.url}`);
    const lyricsData = await lyricsResponse.json();
    return {
      status: "200",
      creator: "letra-lime",
      title: geniusData[0]?.title || "",
      artist: geniusData[0]?.artist.name || "",
      url: geniusData[0]?.url || "",
      lyrics: lyricsData.lyrics || ""
    };
  } catch {
    return {
      status: "error",
      creator: "letra-lime",
      message: "❌ *Terjadi kesalahan*"
    };
  }
}
async function getLyricsTextyl(songTitle) {
  try {
    const response = await fetch(`https://api.textyl.co/api/lyrics?q=${songTitle}`);
    const data = await response.json();
    return data ? data?.map(item => item.lyrics).join("\n") : null;
  } catch {
    return null;
  }
}
async function getLyricsGlobalApi(songTitle) {
  try {
    const response = await fetch(`https://globalapis.onrender.com/api/lyrics?songName=${songTitle}`);
    const data = await response.json();
    return data.lyrics || null;
  } catch {
    return null;
  }
}
async function getLyricsNotApi(songTitle) {
  try {
    const response = await fetch(`https://notapi.vercel.app/api/lyrics?q=${songTitle}`);
    const data = await response.json();
    return data.lyrics ? {
      title: data.title || "",
      artist: data.artist || "",
      url: data.url || "",
      lyrics: data.lyrics || ""
    } : null;
  } catch {
    return null;
  }
}
async function getLyricsKingAryanApi(songTitle) {
  try {
    const response = await fetch(`https://king-aryanapis.onrender.com/api/lyrics?songName=${songTitle}`);
    const data = await response.json();
    return data.lyrics || null;
  } catch {
    return null;
  }
}