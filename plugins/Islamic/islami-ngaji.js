import cheerio from 'cheerio';
import fetch from 'node-fetch';
const handler = async (m, {
  conn,
  args,
  text
}) => {
  try {
    let lister = ["ayat", "surah"];
    let [feature, inputs, inputs_] = text.split("|");
    if (!lister.includes(feature)) return m.reply("*Contoh:*\n.ngaji ayat|edisi\n\n*Pilih type yang ada:*\n\n" +
      lister.map(v => "  ○ " + v).join("\n"));
    m.react(wait);
    if (feature === "ayat") {
      if (!inputs || isNaN(inputs) || isNaN(inputs_)) return m.reply("Masukkan input yang valid");
      let data = await fetchJson('https://api.alquran.cloud/v1/edition/format/audio');
      let edisi = data.data.map((item, index) =>
        `🔍 *[ EDISI ${index + 1} ]*\n\n🌐 *English:* ${item.englishName}\n📛 *Name:* ${item.name}\n`).join(
        "\n\n________________________\n\n");
      if (!inputs_) return m.reply("Pilih edisi yang Anda inginkan\nContoh: .ngaji ayat|edisi\n\n" + edisi);
      if (inputs_ >= 1 && inputs_ <= data.data.length) {
        const index = inputs_ - 1;
        let bagian = data.data[index];
        let res = await getAyahData(inputs, bagian.identifier);
        if (res.code !== 200) return m.reply(res.data);
        let imagers = await getImageUrl(res.data.number, res.data.surah.number);
        let cap =
          `🔍 *[ EDISI ${res.data.edition.englishName} ]*\n\n🌐 *Name:* ${res.data.surah.name}\n📢 *Surah Number:* ${res.data.surah.number}\n📖 *English:* ${res.data.surah.englishName}\n📝 *Text:* ${res.data.text}\n${wait}`;
        conn.sendFile(m.chat, imagers || logo, "", cap, m);
        await conn.sendMessage(m.chat, {
          audio: {
            url: res.data.audio
          },
          seconds: fsizedoc,
          ptt: true,
          mimetype: "audio/mpeg",
          fileName: "vn.mp3",
          waveform: [100, 0, 100, 0, 100, 0, 100]
        }, {
          quoted: m
        });
      } else {
        return m.reply('Nomor yang diminta lebih besar dari jumlah objek yang ada.');
      }
    } else if (feature === "surah") {
      if (!inputs || isNaN(inputs) || isNaN(inputs_)) return m.reply("Masukkan input yang valid");
      if (inputs > 114) return m.reply("Input lebih dari 114");
      let data = await fetchJson(
        'https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn_surah_audio.json');
      let edisi = data.map((item, index) =>
        `🔍 *[ EDISI ${index + 1} ]*\n\n🌐 *English:* ${item.englishName}\n📛 *Name:* ${item.name}\n`).join(
        "\n\n________________________\n\n");
      if (!inputs_) return m.reply("Pilih edisi yang Anda inginkan\nContoh: .ngaji ayat|edisi\n\n" + edisi);
      if (inputs_ >= 1 && inputs_ <= data.length) {
        const index = inputs_ - 1;
        let bagian = data[index];
        let res = await getSurahData(inputs, bagian.identifier);
        if (res.code !== 200) return m.reply(res.data);
        let imagers = await getImageUrl(res.data.number, res.data.numberOfAyahs);
        let audios = await getAudioUrl(bagian.identifier, res.data.number);
        let cap =
          `🌐 *Name:* ${res.data.name}\n\n📢 *Surah:* ${res.data.number}\n📖 *English:* ${res.data.englishName}\n${wait}`;
        conn.sendFile(m.chat, imagers || logo, "", cap, m);
        await conn.sendMessage(m.chat, {
          audio: {
            url: audios
          },
          seconds: fsizedoc,
          ptt: true,
          mimetype: "audio/mpeg",
          fileName: "vn.mp3",
          waveform: [100, 0, 100, 0, 100, 0, 100]
        }, {
          quoted: m
        });
      } else {
        return m.reply('Nomor yang diminta lebih besar dari jumlah objek yang ada.');
      }
    }
  } catch (e) {
    throw e;
  }
}
handler.help = ["ngaji"]
handler.tags = ["internet"]
handler.command = /^(ngaji)$/i
export default handler
async function fetchJson(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
async function getAyahData(ayah, edition) {
  try {
    const ayahUrl = `https://api.alquran.cloud/v1/ayah/${ayah}/${edition}`;
    const ayahData = await fetchJson(ayahUrl);
    return ayahData;
  } catch (error) {
    throw error;
  }
}
async function getSurahData(surah, edition) {
  try {
    const surahUrl = `https://api.alquran.cloud/v1/surah/${surah}/${edition}`;
    const surahData = await fetchJson(surahUrl);
    return surahData;
  } catch (error) {
    throw error;
  }
}

function getImageUrl(surah, ayah) {
  return `https://cdn.islamic.network/quran/images/high-resolution/${surah}_${ayah}.png`;
}

function getAudioUrl(edition, number) {
  return `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${number}.mp3`;
}

function isNaN(input) {
  return Number.isNaN(input);
}
