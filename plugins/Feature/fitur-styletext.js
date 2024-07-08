import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, {
  conn,
  text
}) => {
  let teks = text?.trim() || m.quoted?.text || m.text;
  if (teks.includes("|")) {
    let [nama, urutan] = teks.split("|").map(s => s.trim());
    if (/^\d+$/.test(urutan)) {
      let selectedObj = (await stylizeText(nama))[parseInt(urutan) - 1];
      return selectedObj ? m.reply(formatSelectedStyle(selectedObj, urutan)) : m.reply("Nomor gaya tidak valid. Silakan coba nomor gaya lain.");
    }
  }
  let caption = await stylizeText(teks);
  return m.reply(formatStyleList(caption));
};
handler.help = ["style <teks>"], handler.tags = ["tools"], handler.command = /^(style(text)?)$/i,
  handler.exp = 0;
export default handler;
const stylizeText = async query => {
  try {
    const response = await fetch(`http://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(query)}`),
      html = await response.text(),
      $ = cheerio.load(html);
    return $("table tr").map((i, row) => {
      const cells = $(row).find("td");
      return cells.length > 1 ? {
        name: $(cells[0]).find(".aname").text() || $(cells[0]).text(),
        value: $(cells[1]).html().trim()
      } : null;
    }).get().filter(Boolean);
  } catch (error) {
    throw console.error("Error fetching data:", error), new Error("Failed to fetch and process data");
  }
};

function formatSelectedStyle(selectedObj, urutan) {
  return `🎨 *Gaya Terpilih* 🎨\n\n🔢 *Nomor:* [${urutan}]\n📛 *Nama:* ${selectedObj.name}\n📋 *Isi:* ${selectedObj.value}\n\n🎉 Nikmati gaya tersebut! 🎉`;
}

function formatStyleList(caption) {
  return `📜 *Daftar Gaya* 📜\n\n⚡ Berikut adalah daftar gaya yang tersedia:\n\n${caption.map(({
        name,
        value
    }, index) => "🔢 * Nomor: * [$ {\n    index + 1\n  }] n📛 * Nama: * $ {\n    name\n  }  n📋 * Isi: * $ {\n    value\n  }  n n").join("")}🌟 Pilih gaya dengan menggunakan perintah *style [teks]|[nomor]* 🌟`;
}
