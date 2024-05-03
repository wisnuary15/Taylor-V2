import fetch from 'node-fetch';
import {
    xnxxSearch,
    xnxxDownloader
} from '../../lib/scraper/scraped-downloader.js';

let handler = async (m, {
    conn,
    usedPrefix,
    text,
    args,
    command
}) => {
    try {
        if (command === 'xnxx') {
            if (!text) throw `Contoh penggunaan ${usedPrefix}${command} japan`;
            const res = await xnxxSearch(text);
            const teks = res.result.map((item, index) => `🔍 *[ HASIL ${index + 1} ]*
📚 Judul: ${item.title}
🔗 Link: ${item.link}
📝 Ringkasan: ${item.info}`).filter(v => v).join("\n\n________________________\n\n");
            await m.reply(teks);
        }

        if (command === 'xnxxdl') {
            if (!text) throw `Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-18ctcz24/masi_pakai_seragam_biru_mainnya_di_hotel`;
            const item = await xnxxDownloader(text);
            const teksdl = `🔍 *[ HASIL ]*
📚 Judul: ${item.title}
🔗 Link: ${item.URL}
📝 Ringkasan: ${item.info}`;
            await conn.sendMessage(m.chat, {
                video: {
                    url: item.files.HLS || item.files.high || item.files.low
                },
                caption: teksdl + ' 📥'
            }, {
                quoted: m
            });
        }

        if (command === 'dlxnxx') {
            if (!args[0]) throw `Contoh penggunaan ${usedPrefix}${command} https://www.xnxx.com/video-uy5a73b/mom_is_horny_-_brooklyn`;
            try {
                const json = await fetch(global.API('lolhuman', '/api/xnxx', {
                    url: text
                }, 'apikey'));
                const x = await json.json();
                const caption = `🎥 *Judul:* ${x.result.title}
⌛ *Durasi:* ${x.result.duration}
👀 *Dilihat:* ${x.result.view}
⭐ *Rating:* ${x.result.rating}
👍 *Suka:* ${x.result.like}
👎 *Tidak Suka:* ${x.result.dislike}
💬 *Komentar:* ${x.result.comment}
🏷️ *Tag:* ${Array.from(x.result.tag)}
📝 *Deskripsi:* ${x.result.description}`;
                await conn.sendFile(m.chat, x.result.link[1].link, 'asupan.mp4', caption + ' 📤', m);
            } catch (e) {
                throw `Terjadi kesalahan saat mengunduh: ${e.message} ❌`;
            }
        }
    } catch (error) {
        throw `Terjadi kesalahan: ${error.message} ❌`;
    }
};

handler.help = ['xnxx', 'dlxnxx', 'xnxxdl'].map(v => v + ' <query>');
handler.command = ['xnxx', 'dlxnxx', 'xnxxdl'];
handler.tags = ['nsfw'];

export default handler;