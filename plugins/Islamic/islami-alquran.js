import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  try {
    if (!args[0] || !args[1] || isNaN(args[0]) || isNaN(args[1])) throw `Contoh: ${usedPrefix + command} 1 2\n\nHasilnya adalah surah Al-Fatihah ayat 2`;
    const res = await alquran(args[0], args[1]),
      replyMsg = `\n${res.arab}\n${res.latin}\n\n${res.terjemahan}\n\nTafsir:\n${res.tafsir}\n\nKeterangan:\n${res.keterangan}\n\n(${res.surah})\n`.trim();
    m.reply(replyMsg), await conn.sendMessage(m.chat, {
      audio: {
        url: res.audio
      },
      seconds: fsizedoc,
      ptt: !0,
      mimetype: "audio/mpeg",
      fileName: "vn.mp3",
      waveform: [100, 0, 100, 0, 100, 0, 100]
    });
  } catch (e) {
    throw e;
  }
};
handler.help = ["alquran <114> <1>"], handler.tags = ["quran"], handler.command = /^(al)?quran$/i;
export default handler;

function isNaN(value) {
  return Number.isNaN(Number(value));
}
const alquran = async (surah, ayat) => {
  try {
    const res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`);
    if (!res.ok) throw "Error, mungkin tidak ditemukan?";
    const $ = cheerio.load(await res.text()),
      Surah = $("div.ayat-title > h1").text(),
      arab = $("div.ayat-detail > div.ayat-arab").text(),
      latin = $("div.ayat-detail > div.ayat-latin").text(),
      terjemahan = $("div.ayat-detail > div.ayat-detail-text").text(),
      tafsir = $("div.tafsir-box > div").map(((_, el) => $(el).text())).get().join("\n").trim(),
      keterangan = $("div.ayat-summary").text();
    return {
      surah: Surah,
      arab: arab,
      latin: latin,
      terjemahan: terjemahan,
      tafsir: tafsir,
      audio: `https://raw.githubusercontent.com/AyGemuy/quran-json/main/Audio/${String(surah).padStart(3, "0")}/${String(ayat).padStart(3, "0")}.mp3`,
      keterangan: keterangan
    };
  } catch (e) {
    throw "Terjadi kesalahan saat mengambil data";
  }
};