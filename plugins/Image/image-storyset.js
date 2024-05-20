import axios from "axios"
import cheerio from "cheerio"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    try {
        await m.reply(wait)
        let res = await fetchThumbnailUrls('https://storyset.com/search?q=' + encodeURIComponent(text));
        let rdm = res[Math.floor(Math.random() * res.length)];
        await conn.sendMessage(m.chat, {
            image: {
                url: rdm
            },
            caption: "[ RESULT ]"
        }, {
            quoted: m
        })

    } catch (e) {
        throw eror
    }
}
handler.help = ["storyset"]
handler.tags = ["internet"]
handler.command = /^(storyset)$/i

export default handler

/* New Line */
async function fetchThumbnailUrls(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const thumbnailUrls = $('script[type="application/ld+json"]').toArray()
            .map(element => {
                try {
                    const jsonData = JSON.parse($(element).html());
                    if (jsonData['@type'] === 'ImageObject' && jsonData.thumbnailUrl) {
                        return jsonData.thumbnailUrl;
                    }
                } catch (error) {
                    // Kesalahan parsing JSON, lewati
                }
            }).filter(url => url);

        return thumbnailUrls;
    } catch (error) {
        console.error('Gagal mengambil halaman web:', error);
        return [];
    }
}