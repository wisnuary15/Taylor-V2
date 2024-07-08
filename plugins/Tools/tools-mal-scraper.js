import {
  getInfoFromName
} from "mal-scraper";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  if (!text) throw "input text";
  try {
    m.react(wait);
    const {
      premiered,
      broadcast,
      genres,
      englishTitle,
      japaneseTitle,
      type,
      episodes,
      rating,
      aired,
      score,
      favorites,
      ranked,
      duration,
      studios,
      popularity,
      members,
      scoreStats,
      source,
      synonyms,
      status,
      id,
      picture
    } = await getInfoFromName(text);
    let sym = "  ○";
    const Desc = `      *[ My Anime List ]*\n\n${sym} *Premiered:* ${premiered}\n${sym} *Broadcast:* ${broadcast}\n${sym} *Genres:* ${genres}\n${sym} *English Title:* ${englishTitle}\n${sym} *Japanese Title:* ${japaneseTitle}\n${sym} *Type:* ${type}\n${sym} *Episodes:* ${episodes}\n${sym} *Rating:* ${rating}\n${sym} *Aired:* ${aired}\n${sym} *Score:* ${score}\n${sym} *Favorite:* ${favorites}\n${sym} *Ranked:* ${ranked}\n${sym} *Duration:* ${duration}\n${sym} *Studios:* ${studios}\n${sym} *Popularity:* ${popularity}\n${sym} *Members:* ${members}\n${sym} *Score Stats:* ${scoreStats}\n${sym} *Source:* ${source}\n${sym} *Synonyms:* ${synonyms}\n${sym} *Status:* ${status}\n${sym} *Identifier:* ${id}\n${sym} *Link:* ${id}`;
    await conn.sendFile(m.chat, picture, "", Desc, m);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["malscraper query"], handler.tags = ["internet"], handler.command = /^(malscraper)$/i;
export default handler;
