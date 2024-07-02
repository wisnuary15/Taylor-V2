import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  let text;
  if (args.length >= 1) text = args.slice(0).join(" ");
  else {
    if (!m.quoted || !m.quoted?.text) throw "input text\nEx. .musixmatch minecraft\n<command> <tex>";
    text = m.quoted?.text;
  }
  m.react(wait);
  var v = (await MusixMatch(text)).result;
  const captiond = `*乂 Judul 乂*\n${v.judul}\n*乂 Penyanyi 乂*\n${v.penyanyi}\n\n*乂 Lirik 乂*\n${v.lirik}\n\n*乂 Thumb 乂*\n${v.thumb}`;
  await conn.sendFile(m.chat, v.thumb, "result", captiond, m);
};
handler.help = ["musixmatch"], handler.tags = ["search"], handler.command = /^musi[ckx]match$/i;
export default handler;
async function MusixMatch(query) {
  try {
    const searchUrl = "https://www.musixmatch.com/search/" + query,
      searchResponse = await fetch(searchUrl),
      searchData = await searchResponse.text(),
      ch = cheerio.load(searchData),
      songUrl = "https://www.musixmatch.com" + ch("#search-all-results").find("div.main-panel > div:nth-child(1) > div.box-content > div > ul > li > div > div.media-card-body > div > h2 > a").attr("href"),
      songResponse = await fetch(songUrl),
      songData = await songResponse.text(),
      $ = cheerio.load(songData);
    $("script").remove();
    const title = $("#site > div > div > div > main > div > div > div.mxm-track-banner.top > div > div > div").find("div.col-sm-10.col-md-8.col-ml-9.col-lg-9.static-position > div.track-title-header > div.mxm-track-title > h1").text().trim(),
      artist = $("#site > div > div > div > main > div > div > div > div > div > div > div> div > div > h2 > span").text().trim(),
      thumb = $("#site > div > div > div > main > div > div > div.mxm-track-banner.top > div > div > div").find("div.col-sm-1.col-md-2.col-ml-3.col-lg-3.static-position > div > div > div > img").attr("src");
    let lyrics = "";
    $("#site > div > div > div > main > div > div > div.mxm-track-lyrics-container").find("div.container > div > div > div > div.col-sm-10.col-md-8.col-ml-6.col-lg-6 > div.mxm-lyrics").each(function(a, b) {
      const text = $(b).find("span").text().trim();
      text.length > 0 && "" === lyrics && (lyrics = text);
    });
    return {
      result: {
        judul: title.replace("Lyrics", "") || "Tidak ada",
        penyanyi: artist || "Tidak ada",
        thumb: "https:" + thumb || "Tidak ada",
        lirik: lyrics || "Tidak ada"
      }
    };
  } catch (error) {
    throw error;
  }
}
