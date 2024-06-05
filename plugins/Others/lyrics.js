import {
    lyrics
} from "@bochilteam/scraper";
import fetch from "node-fetch";
import Genius from "genius-lyrics";
import axios from "axios";
import cheerio from "cheerio";
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length ? args.join(" ") : (m.quoted?.text || null);
    if (!text) throw "Masukkan judul musik!\n*Example:* .lirik hello";
    const key = "h6fTn1BYNjYi5VTszhyAFTcM3WWtk2E4hqrXCcutfObE4jVFnJ3LVyewHKIYTli7";
    const Client = new Genius.Client(key);
    const song = await Client.songs.search(text);
    const nothing = "Tidak diketahui!";
    try {
        const bocil = await lyrics(text);
        const bocap = `*乂 Judul 乂*\n${bocil.title || nothing}\n\n*乂 Lirik 乂*\n${bocil.lyrics || nothing}\n\n*乂 Penyanyi 乂*\n${bocil.author || nothing}\n\n*乂 Url 乂*\n${bocil.link || nothing}\n\n_By BochilTeam_`;
        m.reply(bocap);
    } catch (e) {
        try {
            const jenius = song[0];
            const albert = `*乂 Judul 乂*\n${jenius.title || nothing}\n\n*乂 Lirik 乂*\n${await getLyrics(jenius.url)}\n\n*乂 Penyanyi 乂*\n${(await jenius.artist).name || nothing}\n\n*乂 Url 乂*\n${jenius.url || nothing}\n\n_By Genius_`;
            m.reply(albert);
        } catch (e) {
            try {
                const lyricsFreakLyrics = await getLyricsFreakLyrics(text);
                const frank = `*乂 Lirik 乂*\n${lyricsFreakLyrics}\n\n_By lyricsfreak_`;
                m.reply(frank);
            } catch (e) {
                throw 'Tidak dapat menemukan lirik!';
            }
        }
    }
};
handler.help = ["lirik"]?.map(v => v + " <judul>");
handler.tags = ["internet"];
handler.command = /^l(irik(musik)?|yrics?)$/i;
export default handler;
async function getLyrics(url) {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    let lyrics = '';
    $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
            const snippet = $(elem).html().replace(/<br>/g, '\n').replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
            lyrics += $('<textarea/>').html(snippet).text().trim() + '\n\n';
        }
    });
    return lyrics;
}
async function getLyricsFreakLyrics(songTitle) {
    try {
        const {
            data
        } = await axios.get(`https://www.lyricsfreak.com/search.php?a=search&q=${songTitle}`);
        const $ = cheerio.load(data);
        const songLink = $(".song").attr("href");
        if (!songLink) throw 'Lirik tidak ditemukan di LyricsFreak';
        const songPage = await axios.get(`https://www.lyricsfreak.com${songLink}`);
        const $$ = cheerio.load(songPage.data);
        const lyrics = $$(".lyrictxt").text();
        return lyrics;
    } catch (error) {
        throw 'Lirik tidak ditemukan di LyricsFreak';
    }
}
