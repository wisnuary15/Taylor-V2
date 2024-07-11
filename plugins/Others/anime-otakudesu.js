import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  text
}) => {
  const [subcommand, query] = text.split("|").map(str => str.trim().toLowerCase());
  if (!subcommand || !query) return m.reply("Masukkan command dengan benar. Contoh: .otakudesu search|nama_anime");
  let reply = "";
  const separator = "========================";
  if ("search" === subcommand) {
    const searchResults = await searchData(query);
    searchResults && searchResults.length > 0 ? (reply = searchResults.map(result => `✨ *${result.title}*\n🔗 Link: ${result.link}\n🎭 Genre: ${result.genres.join(", ")}\n⚖️ Status: ${result.status}\n⭐️ Rating: ${result.rating}\n`).join(`\n${separator}\n`), reply = "Hasil pencarian:\n" + separator + "\n" + reply) : reply = "Maaf, tidak ditemukan hasil pencarian.";
  } else if ("episode" === subcommand) {
    const episodeResults = await episodeData(query);
    episodeResults && episodeResults.episodes.length > 0 ? (reply = episodeResults.episodes.map(episode => `📺 Episode: ${episode.title}\n🔗 Link: ${episode.url}\n📅 Tanggal: ${episode.date}\n`).join(`\n${separator}\n`), reply = `Daftar episode: untuk *${episodeResults.title}*\n` + separator + "\n" + reply) : reply = "Maaf, tidak ditemukan informasi episode.";
  } else if ("download" === subcommand) {
    const downloadResults = await linkDownloadData(query);
    downloadResults ? (reply = downloadResults.episodes.map(episode => {
      const links = episode.links.map(link => `🔗 ${link.text}: ${link.url}`).join("\n");
      return `📺 Episode: ${episode.title}\n${links}\n💾 Size: ${episode.size}\n`;
    }).join(`\n${separator}\n`), reply = `Download link: untuk *${downloadResults.title}*\n🔗 Stream: ${downloadResults.frame}\n` + separator + "\n" + reply) : reply = "Maaf, tidak ditemukan link download.";
  } else if ("video" === subcommand) {
    let doc = {
      video: {
        url: await videoData(query)
      },
      mimetype: "video/mp4",
      caption: "*[ Result ]*"
    };
    await conn.sendMessage(m.chat, doc, {
      quoted: m
    });
  } else reply = "Subcommand tidak valid.";
  m.reply(reply);
};
handler.help = ["otakudesu"], handler.tags = ["anime"], handler.command = /^(otakudesu)$/i;
export default handler;
async function searchData(q) {
  const url = "https://otakudesu.asia/?s=" + q;
  try {
    const response = await fetch(url),
      htmlData = await response.text(),
      $ = cheerio.load(htmlData);
    return $(".chivsrc li").map((index, element) => {
      const genres = $(element).find(".set a[rel=\"tag\"]").map((i, el) => $(el).text()).get(),
        status = $(element).find(".set:contains(\"Status\")").text()?.replace("Status : ", ""),
        rating = parseFloat($(element).find(".set:contains(\"Rating\")").text()?.replace("Rating : ", ""));
      return {
        title: $(element).find("h2 a").text() || "Tidak diketahui",
        link: $(element).find("h2 a").attr("href") || "Tidak diketahui",
        genres: genres.length ? genres : ["Tidak diketahui"],
        status: status || "Tidak diketahui",
        rating: isNaN(rating) ? "Tidak diketahui" : rating
      };
    }).get();
  } catch (error) {
    return console.error("Error fetching data:", error), null;
  }
}
async function linkDownloadData(url) {
  try {
    const response = await fetch(url),
      htmlData = await response.text(),
      $ = cheerio.load(htmlData),
      iframeSrc = $("#lightsVideo iframe").attr("src"),
      episodes = $(".download li").map((index, element) => ({
        title: $(element).find("strong").text(),
        links: $(element).find("a").map((index, linkElement) => ({
          text: $(linkElement).text().trim(),
          url: $(linkElement).attr("href")
        })).get(),
        size: $(element).find("i").text().trim()
      })).get(),
      details = {
        title: $("h4").text().trim(),
        frame: iframeSrc,
        episodes: episodes
      };
    return console.log(JSON.stringify(details, null, 2)), details;
  } catch (error) {
    return console.error("Error fetching data:", error), null;
  }
}
async function episodeData(url) {
  try {
    const response = await fetch(url),
      htmlData = await response.text(),
      $ = cheerio.load(htmlData),
      episodes = [];
    $(".episodelist ul li").each((index, element) => {
      const title = $(element).find("a").text().trim(),
        url = $(element).find("a").attr("href"),
        date = $(element).find(".zeebr").text().trim();
      episodes.push({
        title: title,
        url: url,
        date: date
      });
    });
    const details = {
      title: $(".monktit").text().trim(),
      episodes: episodes
    };
    return console.log(JSON.stringify(details, null, 2)), details;
  } catch (error) {
    return console.error("Error fetching data:", error), null;
  }
}
async function videoData(url) {
  try {
    const response = await fetch(url),
      html = await response.text(),
      regex = /sources:\s*(\[.*?\])/,
      matches = html.match(regex);
    if (matches) {
      const jsonObject = JSON.parse(matches[1].replace(/'/g, "\""));
      return jsonObject[0]?.file;
    }
    throw new Error("Data not found");
  } catch (error) {
    throw console.error("Terjadi kesalahan:", error.message), error;
  }
}
