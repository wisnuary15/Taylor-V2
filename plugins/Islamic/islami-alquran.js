import fetch from "node-fetch";
import cheerio from "cheerio";

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        if (!args[0] || !args[1] || isNaN(args[0]) || isNaN(args[1]))
            throw `Contoh: ${usedPrefix + command} 1 2\n\nHasilnya adalah surah Al-Fatihah ayat 2`;

        const res = await alquran(args[0], args[1]);

        const replyMsg = `
${res.arab}
${res.latin}

${res.terjemahan}

Tafsir:
${res.tafsir}

Keterangan:
${res.keterangan}

(${res.surah})
`.trim();

        m.reply(replyMsg);

        await conn.sendMessage(m.chat, {
            audio: {
                url: res.audio
            },
            seconds: fsizedoc,
            ptt: true,
            mimetype: "audio/mpeg",
            fileName: "vn.mp3",
            waveform: [100, 0, 100, 0, 100, 0, 100]
        });
    } catch (e) {
        throw e;
    }
};

handler.help = ["alquran <114> <1>"];
handler.tags = ["quran"];
handler.command = /^(al)?quran$/i;
export default handler;

function isNaN(value) {
    return Number.isNaN(Number(value));
}

const alquran = async (surah, ayat) => {
    try {
        const res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`);
        if (!res.ok) throw "Error, mungkin tidak ditemukan?";
        const $ = cheerio.load(await res.text());
        const Surah = $("div.ayat-title > h1").text();
        const arab = $("div.ayat-detail > div.ayat-arab").text();
        const latin = $("div.ayat-detail > div.ayat-latin").text();
        const terjemahan = $("div.ayat-detail > div.ayat-detail-text").text();
        const tafsir = $("div.tafsir-box > div").map((_, el) => $(el).text()).get().join('\n').trim();
        const keterangan = $("div.ayat-summary").text();
        const audio = `https://raw.githubusercontent.com/AyGemuy/quran-json/main/Audio/${String(surah).padStart(3, '0')}/${String(ayat).padStart(3, '0')}.mp3`;
        return {
            surah: Surah,
            arab,
            latin,
            terjemahan,
            tafsir,
            audio,
            keterangan
        };
    } catch (e) {
        throw "Terjadi kesalahan saat mengambil data";
    }
};