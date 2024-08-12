import {
  spotifySearch
} from "../../lib/scraper/scraped-downloader.js";
import fetch from "node-fetch";
const handler = async (m, {
  conn,
  text
}) => {
  if (!text) throw "Masukkan judul musik!";
  try {
    let json = await spotifySearch(text),
      {
        title,
        artist,
        album,
        thumbnail,
        url,
        preview_mp3
      } = json[0],
      spotifyinfo = `✨️ *Title:* ${title}\n🗣️ *Artists:* ${artist}\n🎆️ *Album:* ${album}\n🌐️ *URL*: ${url}\n💚️ *Direct URL:* ${preview_mp3}`;
    await conn.sendFile(m.chat, thumbnail, "", spotifyinfo, m), await conn.sendFile(m.chat, preview_mp3, "spotify.mp3", spotifyinfo, m);
  } catch (e) {
    try {
      let json = await search(text),
        {
          title,
          artist,
          album,
          thumbnail,
          release_date,
          audio
        } = json[0],
        spotifyinfo = `✨️ *Title:* ${title}\n🗣️ *Artists:* ${artist}\n🎆️ *Album:* ${album}\n🌐️ *Date*: ${release_date}\n💚️ *Direct URL:* ${audio}`;
      await conn.sendFile(m.chat, thumbnail, "", spotifyinfo, m), await conn.sendFile(m.chat, audio, "spotify.mp3", spotifyinfo, m);
    } catch (e) {
      m.react(eror);
    }
  }
};
handler.help = ["spotify <query>"], handler.tags = ["internet"], handler.command = /^(spotify|music)$/i;
export default handler;
const MusicApiJamendoBaseUrl = "https://api.jamendo.com";
async function search(query, limitValue = 50) {
  try {
    const response = await fetch(`${MusicApiJamendoBaseUrl}/v3.0/tracks/?client_id=f5db3eb4&format=json&limit=${validatingLimit(limitValue)}&order=downloads_total&include=&imagesize=200&groupby=artist_id&namesearch=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && Array.isArray(data.results) && data.results.length) {
      const _sortie = [];
      const _filtered = data.results.filter(v => v.audiodownload_allowed && v.audio);
      for (const obj of _filtered) {
        _sortie.push({
          title: obj.name,
          artist: obj.artist_name,
          album: obj.album_name,
          release_date: obj.releasedate,
          thumbnail: obj.image,
          audio: obj.audio
        });
      }
      return _sortie;
    } else {
      throw new Error(data?.headers?.error_message || data?.headers?.warnings || `Failed to retrieve data from ${MusicApiJamendoBaseUrl}`);
    }
  } catch (e) {
    return {
      error: true,
      message: String(e)
    };
  }
}