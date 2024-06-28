import axios from "axios";
import {
  search
} from "aptoide-scraper";
import {
  sizeFormatter
} from "human-readable";
const format = sizeFormatter({
    std: "JEDEC",
    decimalPlaces: 2,
    keepTrailingZeroes: !1,
    render: (literal, symbol) => `${literal} ${symbol}B`
  }),
  handler = async (m, {
    conn,
    text
  }) => {
    if (!text) throw "Tolong berikan kata kunci pencarian";
    try {
      m.reply("Sedang mencari, mohon tunggu...");
      const aptoideResult = await axios.get("http://ws75.aptoide.com/api/7/apps/search?query=" + encodeURIComponent(text) + "&trusted=true");
      if (0 === aptoideResult.data.datalist.total) throw `Pencarian "${text}" tidak ditemukan :/`;
      const resultList = aptoideResult.data.datalist.list.map((item, index) => `📱 *Aptoide Search* 🔍\n*Nama Aplikasi:* ${item.package}\n*Versi:* ${item.file.vername}\n*Ukuran:* ${format(item.file.filesize)}\n*Link Unduh:* ${item.file.path}\n*Jumlah Unduhan:* ${item.stats.downloads}\n`).join("\n");
      m.reply(resultList);
    } catch (error) {
      try {
        m.reply("Sedang mencari, mohon tunggu...");
        const searchList = (await search(text)).map((item, index) => `📱 *Aptoide Search* 🔍\n*Nama Aplikasi:* ${item.name}\n*ID:* ${item.id}\n`).join("\n");
        m.reply(searchList);
      } catch (err) {
        m.reply("Maaf, terjadi kesalahan dalam mencari.");
      }
    }
  };
handler.help = ["aptoide"], handler.tags = ["tools"], handler.command = /^aptoide(search)?$/i;
export default handler;