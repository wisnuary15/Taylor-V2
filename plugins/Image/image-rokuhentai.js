import fetch from 'node-fetch';
import cheerio from 'cheerio';
import PDFDocument from 'pdfkit';

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    await m.reply(wait)
    try {
        let data = await rokuSearch(text)

        let buff = await createPDFBuffer(data[0].allImageUrls)
        await conn.sendFile(m.chat, buff, "", data[0].title, m)
    } catch (e) {
        throw eror
    }
}
handler.help = ["rokuhentai"]
handler.tags = ["search"]
handler.command = /^(rokuhentai)$/i
export default handler

async function rokuSearch(q) {
    try {
        const response = await fetch('https://rokuhentai.com/_search?q=' + q);
        const jsonData = await response.json();

        return jsonData["manga-cards"].map((html) => {
            const $ = cheerio.load(html);
            const title = $('.mdc-typography--body1.site-manga-card__title--primary').text().trim().replace(/[\n\s]+/g, ' ');

            const captionElement = $('.mdc-typography--caption:contains("images")');
            const numImagesMatch = captionElement.text().trim().match(/(\d+)\s*images/);
            const numImages = parseInt(numImagesMatch ?? 0, 10);

            const timestampText = captionElement.contents().filter((i, el) => el.nodeType === 3).text().trim().replace(/\s+/g, ' ');

            const mangaLink = $('a').attr('href') || '';
            const allImageUrls = new Array(numImages).fill().map((_, i) => `${mangaLink.replace("https://rokuhentai.com/", "https://rokuhentai.com/_images/pages/")}${i === 0 ? '0' : i}.jpg`);

            return {
                title,
                numImages,
                timestamp: timestampText.split('images')[1] ?? '',
                mangaLink,
                allImageUrls,
                detailsLink: $('a:contains("Details")').attr('href') || '',
            };
        });
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function createPDFBuffer(imageUrls) {
    return new Promise(async (resolve, reject) => {
        try {
            const pdfDoc = new PDFDocument();
            const buffers = [];

            for (const imageUrl of imageUrls) {
                try {
                    const response = await fetch(imageUrl);
                    const imageBuffer = await response.arrayBuffer();
                    pdfDoc.addPage().image(imageBuffer, {
                        width: 600
                    });
                } catch (error) {
                    console.error(`Error fetching image at ${imageUrl}:`, error.message);
                }
            }

            pdfDoc.end();
            pdfDoc.on('data', buffer => buffers.push(buffer));
            pdfDoc.on('end', () => resolve(Buffer.concat(buffers)));
        } catch (error) {
            reject(error);
        }
    });
}