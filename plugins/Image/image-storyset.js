import axios from "axios";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait);
    let res = await fetchThumbnailUrls("https://storyset.com/search?q=" + encodeURIComponent(text)),
      rdm = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, {
      image: {
        url: rdm
      },
      caption: "[ RESULT ]"
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["storyset"], handler.tags = ["internet"], handler.command = /^(storyset)$/i;
export default handler;
async function fetchThumbnailUrls(url) {
  try {
    const response = await axios.get(url),
      $ = cheerio.load(response.data),
      thumbnailUrls = $("script[type=\"application/ld+json\"]").toArray().map(element => {
        try {
          const jsonData = JSON.parse($(element).html());
          if ("ImageObject" === jsonData["@type"] && jsonData.thumbnailUrl) return jsonData.thumbnailUrl;
        } catch (error) {}
      }).filter(url => url);
    return thumbnailUrls;
  } catch (error) {
    return console.error("Gagal mengambil halaman web:", error), [];
  }
}