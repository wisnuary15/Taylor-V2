import fetch from "node-fetch";
import cheerio from "cheerio";

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        if (!(args[0] || args[1]))
            throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2`;
        if (isNaN(args[0]) || isNaN(args[1]))
            throw `contoh:\n${usedPrefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 `;

        const res = await alquran(args[0], args[1]);

        const replyMsg = `
${res.arab}
${res.latin}

${res.terjemahan}

Tafsir:
${res.tafsir}

Keterangan:
${res.keterangan}

( ${res.surah} )
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
        }, {
            quoted: m
        });
    } catch (e) {
        throw e;
    }
};

handler.help = ["alquran <114> <1>"];
handler.tags = ["quran"];
handler.command = /^(al)?quran$/i;
export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

async function alquran(surah, ayat) {
    try {
        const res = await fetch(`https://kalam.sindonews.com/ayat/${ayat}/${surah}`);
        if (!res.ok) throw "Error, maybe not found?";
        const $ = cheerio.load(await res.text());
        const content = $("div.detail-content");
        const Surah = $("div.ayat-title > h1").text();
        const arab = $("div.ayat-detail > div.ayat-arab").text();
        const latin = $("div.ayat-detail > div.ayat-latin").text();
        const terjemahan = $("div.ayat-detail > div.ayat-detail-text").text();
        const tafsir = $("div.tafsir-box > div").map((_, el) => $(el).text()).get().join('\n').trim();
        const keterangan = $("div.ayat-summary").text();
        const audio = `https://raw.githubusercontent.com/AyGemuy/quran-json/main/Audio/${surah < 10 ? "00" : surah >= 10 && surah < 100 ? "0" : ""}${surah}/${ayat < 10 ? "00" : ayat >= 10 && ayat < 100 ? "0" : ""}${ayat}.mp3`;
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
        throw "Error occurred while fetching data";
    }
}