import axios from 'axios';
import cheerio from 'cheerio';
import PDFDocument from "pdfkit";

export default class KomikCast {
    baseUrl = 'https://komikcast.io';
    header = {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': this.baseUrl,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36',
        },
    };

    search = async (query, {
        type
    }) => {
        try {
            const url = `${this.baseUrl}/?s=${query}`;
            const html = await axios.get(url, this.header);
            const $ = cheerio.load(html.data);
            const data = $('.list-update_item')
                .filter((i, e) => type ? $(e).find('.type').text().trim() === type : true)
                .map((i, e) => ({
                    title: $(e).find('h3').text().trim(),
                    type: $(e).find('.type').text().trim(),
                    chapter: $(e).find('.chapter').text().trim(),
                    score: $(e).find('.numscore').text().trim(),
                    url: $(e).find('a').attr('href').trim(),
                })).get();

            if (data.length < 1) return {
                creator: 'Wudysoft',
                status: false,
                msg: 'Content not found!',
            };
            return {
                creator: 'Wudysoft',
                status: true,
                data,
            };
        } catch (e) {
            console.error(e);
            return {
                creator: 'Wudysoft',
                status: false,
            };
        }
    };


    type = async (type) => {
        try {
            const html = await axios.get(`${this.baseUrl}/type/${type}/`, this.header);
            const $ = cheerio.load(html.data);
            const data = $('.list-update_item').map((i, e) => ({
                title: $(e).find('h3').text().trim(),
                type: $(e).find('.type').text().trim(),
                chapter: $(e).find('.chapter').text().trim(),
                score: $(e).find('.numscore').text().trim(),
                url: $(e).find('a').attr('href').trim(),
            })).get();

            if (data.length < 1) return {
                creator: 'Wudysoft',
                status: false,
                msg: 'Content not found!',
            };
            return {
                creator: 'Wudysoft',
                status: true,
                data,
            };
        } catch (e) {
            console.error(e);
            return {
                creator: 'Wudysoft',
                status: false,
            };
        }
    };

    info = async (url) => {
        try {
            const html = await axios.get(url, this.header);
            const $ = cheerio.load(html.data);

            const komikInfo = {
                title: $('.komik_info-content-body-title').text().trim(),
                nativeTitle: $('.komik_info-content-native').text().trim(),
                genres: $('.komik_info-content-genre a').map((i, el) => $(el).text().trim()).get(),
                releaseYear: $('.komik_info-content-info-release').text().trim().replace('Released:', ''),
                author: $('.komik_info-content-info:contains("Author")').text().trim().replace('Author:', ''),
                status: $('.komik_info-content-info:contains("Status")').text().trim().replace('Status:', ''),
                type: $('.komik_info-content-info-type a').text().trim(),
                totalChapters: $('.komik_info-content-info:contains("Total Chapter")').text().trim().replace('Total Chapter:', ''),
                lastUpdated: $('.komik_info-content-update time').attr('datetime').trim(),
                rating: $('.komik_info-content-rating-bungkus .data-rating').data('ratingkomik'),
                bookmarked: $('#bookmark').data('bookmarked') === 'true',
                synopsis: $('.komik_info-description-sinopsis').text().trim(),
                chapters: $('.komik_info-chapters-item').map((i, el) => {
                    const chapterLink = $(el).find('.chapter-link-item');
                    const chapterTime = $(el).find('.chapter-link-time');
                    return {
                        title: chapterLink.text().trim(),
                        url: chapterLink.attr('href').trim(),
                        time: chapterTime.text().trim(),
                    };
                }).get(),
            };

            return komikInfo;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    image = async (url) => {
        try {
            const html = await axios.get(url, this.header);
            const $ = cheerio.load(html.data);

            const imageUrls = $('.main-reading-area img').map((i, el) => $(el).attr('src').trim()).get();

            return imageUrls;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    imagePdf = async (imageUrls) => {
        const pdfDoc = new PDFDocument();
        const buffers = [];

        for (const imageUrl of imageUrls) {
            try {
                const response = await axios.get(imageUrl, {
                    responseType: "arraybuffer"
                });
                const imageBuffer = Buffer.from(response.data);

                pdfDoc.addPage({
                    size: [imageBuffer.length, imageBuffer.length]
                });
                pdfDoc.image(imageBuffer, 0, 0);
                buffers.push(pdfDoc);
                pdfDoc.addPage();
            } catch (error) {
                console.error(`Error fetching image from ${imageUrl}: ${error.message}`);
            }
        }

        pdfDoc.end();

        return new Promise((resolve) => {
            const chunks = [];
            pdfDoc.on("data", (chunk) => chunks.push(chunk));
            pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        });
    };

}