import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import got from "got";
const API_KEY = "46a908cae9e6fe663a1fe8ef339f08f6",
  handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
  }) => {
    let lister = ["search", "top", "lyrics", "track"],
      [feature, inputs, inputs_, inputs__, inputs___] = text.split("|");
    if (!lister.includes(feature)) return m.reply("*Example:*\n.mm search|adel\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
    if (lister.includes(feature)) {
      if ("search" === feature) {
        if (!inputs) return m.reply("Input query link\nExample: .mm search|hello");
        m.react(wait);
        try {
          let teks = (await Search(inputs)).map((v, index) => `*乂 Search ${index + 1} 乂*\n*track_id:* ${v.track.track_id}\n*commontrack_id:* ${v.track.commontrack_id}\n*track_name:* ${v.track.track_name}\n*track_rating:* ${v.track.track_rating}\n*has_lyrics:* ${v.track.has_lyrics}\n*artist_name:* ${v.track.artist_name}\n*updated_time:* ${v.track.updated_time}\n*track_share_url:* ${v.track.track_share_url}\n`.trim()).filter(v => v).join("\n\n________________________\n\n");
          await conn.reply(m.chat, teks, m, adReply);
        } catch (e) {
          m.react(eror);
        }
      }
      if ("top" === feature) {
        if (!inputs) return m.reply("Input query link\nExample: .mm search|hello");
        m.react(wait);
        try {
          let teks = (await Top()).map((v, index) => `*乂 Top ${index + 1} 乂*\n*track_id:* ${v.track.track_id}\n*commontrack_id:* ${v.track.commontrack_id}\n*track_name:* ${v.track.track_name}\n*track_rating:* ${v.track.track_rating}\n*has_lyrics:* ${v.track.has_lyrics}\n*artist_name:* ${v.track.artist_name}\n*updated_time:* ${v.track.updated_time}\n*track_share_url:* ${v.track.track_share_url}\n`.trim()).filter(v => v).join("\n\n________________________\n\n");
          await conn.reply(m.chat, teks, m, adReply);
        } catch (e) {
          m.react(eror);
        }
      }
      if ("lyrics" === feature) {
        if (!inputs) return m.reply("Input query link\nExample: .mm search|hello");
        m.react(wait);
        try {
          let res = await Lyrics(inputs),
            teks = `*乂 Lirik 乂*\n${res.lyrics_body ? res.lyrics_body : "Tidak diketahui"}\n\n*乂 Copyright 乂*\n${res.lyrics_copyright ? res.lyrics_copyright : "Tidak diketahui"}\n\n*乂 Update 乂*\n${res.updated_time ? res.updated_time : "Tidak diketahui"}\n\n_By musixmatch_\n`;
          await conn.reply(m.chat, teks, m, adReply);
        } catch (e) {
          m.react(eror);
        }
      }
      if ("track" === feature) {
        if (!inputs) return m.reply("Input query link\nExample: .mm search|hello");
        m.react(wait);
        try {
          let res = await Track(inputs),
            teks = `*乂 Track 乂*\n*track_id:* ${res.track_id}\n*commontrack_id:* ${res.commontrack_id}\n*track_name:* ${res.track_name}\n*album_id:* ${res.album_id}\n*album_name:* ${res.album_name}\n*artist_name:* ${res.artist_name}\n*updated_time:* ${res.updated_time}\n*track_share_url:* ${res.track_share_url}\n`;
          await conn.reply(m.chat, teks, m, adReply);
        } catch (e) {
          m.react(eror);
        }
      }
    }
  };
handler.help = ["mm type query"], handler.tags = ["internet"], handler.command = /^(mm)$/i;
export default handler;
async function Search(QUERY) {
  const SEARCH_URL = "https://api.musixmatch.com/ws/1.1/track.search?q_track=" + QUERY + "&page_size=10&page=1&s_track_rating=desc&apikey=" + API_KEY,
    response = await fetch(SEARCH_URL),
    data = await response.json(),
    {
      track_list
    } = data.message.body;
  return track_list;
}
async function Top() {
  const TOP_TEN_SONGS_URL = "https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=10&country=ind&f_has_lyrics=1&apikey=" + API_KEY,
    response = await fetch(TOP_TEN_SONGS_URL),
    data = await response.json(),
    {
      track_list
    } = data.message.body;
  return track_list;
}
async function Lyrics(TRACK_ID) {
  const FETCH_LYRICS_URL = "https://api.musixmatch.com/ws/1.1/track.lyrics.get?commontrack_id=" + TRACK_ID + "&apikey=" + API_KEY,
    response = await fetch(FETCH_LYRICS_URL),
    data = await response.json(),
    {
      lyrics
    } = data.message.body;
  return lyrics;
}
async function Track(TRACK_ID) {
  const FETCH_TRACK_URL = "https://api.musixmatch.com/ws/1.1/track.get?commontrack_id=" + TRACK_ID + "&apikey=" + API_KEY,
    response = await fetch(FETCH_TRACK_URL),
    data = await response.json(),
    {
      track
    } = data.message.body;
  return track;
}
