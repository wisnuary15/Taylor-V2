import { getInfoFromName } from "mal-scraper";
const handler = async (m, { command: command, usedPrefix: usedPrefix, conn: conn, text: text, args: args }) => {
  if (!text) throw "input text";
  try {
    m.react(wait);
    const { premiered: premiered, broadcast: broadcast, genres: genres, englishTitle: englishTitle, japaneseTitle: japaneseTitle, type: type, episodes: episodes, rating: rating, aired: aired, score: score, favorites: favorites, ranked: ranked, duration: duration, studios: studios, popularity: popularity, members: members, scoreStats: scoreStats, source: source, synonyms: synonyms, status: status, id: id, picture: picture } = await getInfoFromName(text);
    let sym = "  ○";
    const Desc = `      *[ My Anime List ]*\n\n${sym} *Premiered:* ${premiered}\n${sym} *Broadcast:* ${broadcast}\n${sym} *Genres:* ${genres}\n${sym} *English Title:* ${englishTitle}\n${sym} *Japanese Title:* ${japaneseTitle}\n${sym} *Type:* ${type}\n${sym} *Episodes:* ${episodes}\n${sym} *Rating:* ${rating}\n${sym} *Aired:* ${aired}\n${sym} *Score:* ${score}\n${sym} *Favorite:* ${favorites}\n${sym} *Ranked:* ${ranked}\n${sym} *Duration:* ${duration}\n${sym} *Studios:* ${studios}\n${sym} *Popularity:* ${popularity}\n${sym} *Members:* ${members}\n${sym} *Score Stats:* ${scoreStats}\n${sym} *Source:* ${source}\n${sym} *Synonyms:* ${synonyms}\n${sym} *Status:* ${status}\n${sym} *Identifier:* ${id}\n${sym} *Link:* ${id}`;
    await conn.sendFile(m.chat, picture, "", Desc, m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["malscraper query"], handler.tags = ["internet"], handler.command = /^(malscraper)$/i;
export default handler;