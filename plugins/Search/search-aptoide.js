import fetch from "node-fetch";
import {
  search
} from "aptoide-scraper";
import {
  sizeFormatter
} from "human-readable";
const format = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  keepTrailingZeroes: false
});
const fetchAPI = async url => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (err) {
    throw new Error(`Fetch error: ${err.message}`);
  }
};
const handler = async (m, {
  conn,
  text
}) => {
  if (!text) return m.reply("❌ Berikan kata kunci pencarian");
  m.react(wait);
  try {
    const res = await fetchAPI(`http://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(text)}&trusted=true`);
    if (res.datalist.total === 0) return m.reply(`❌ "${text}" tidak ditemukan :/`);
    const resultList = res.datalist.list.map((item, i) => `
🔢 *No. Urut:* ${i + 1}
📱 *Nama:* ${item.name}
🆔 *Paket:* ${item.package}
👨‍💻 *Pengembang:* ${item.developer?.name}
📝 *Versi:* ${item.file?.vername}
🔄 *Update:* ${item.modified}
📆 *Ditambahkan:* ${item.added}
📂 *Ukuran:* ${format(item.file?.filesize)}
🌟 *Rating:* ${item.stats.rating?.avg || "N/A"} (Total: ${item.stats.rating?.total || 0} ulasan)
📥 *Unduhan:* ${item.stats.downloads}
🛡️ *Keamanan:* ${item.file?.malware?.rank}
🔗 [Unduh Disini](${item.file?.path})
🔗 [Unduh Alternatif](${item.file?.path_alt})
━━━━━━━━━━━━━━━━━━━
`).join("");
    m.reply(resultList);
  } catch (err) {
    try {
      const searchResults = await search(text);
      const searchList = searchResults.map((item, i) => `
🔢 *No. Urut:* ${i + 1}
📱 *Nama:* ${item.name}
🆔 *ID:* ${item.id}
━━━━━━━━━━━━━━━━━━━
`).join("");
      m.reply(searchList);
    } catch (err) {
      m.react(eror);
    }
  }
};
handler.help = ["aptoide"];
handler.tags = ["tools"];
handler.command = /^aptoide(search)?$/i;
export default handler;
