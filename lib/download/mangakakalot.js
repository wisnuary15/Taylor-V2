import cheerio from 'cheerio';
import {
    fetch
} from 'undici';
import moment from 'moment-timezone';
import fakeUserAgent from 'fake-useragent';
import PDFDocument from 'pdfkit';
import {
    PassThrough
} from 'stream';

const convertToDate = (date) => moment.utc(date).tz('Asia/Jakarta').format('DD MMMM YYYY');

const MangakakalotGenres = {
    'Action': '2',
    'Adult': '3',
    'Adventure': '4',
    'Comedy': '6',
    'Cooking': '7',
    'Doujinshi': '9',
    'Drama': '10',
    'Ecchi': '11',
    'Fantasy': '12',
    'Gender bender': '13',
    'Harem': '14',
    'Historical': '15',
    'Horror': '16',
    'Isekai': '45',
    'Josei': '17',
    'Manhua': '44',
    'Manhwa': '43',
    'Martial arts': '19',
    'Mature': '20',
    'Mecha': '21',
    'Medical': '22',
    'Mystery': '24',
    'One shot': '25',
    'Psychological': '26',
    'Romance': '27',
    'School life': '28',
    'Sci fi': '29',
    'Seinen': '30',
    'Shoujo': '31',
    'Shoujo ai': '32',
    'Shounen': '33',
    'Shounen ai': '34',
    'Slice of life': '35',
    'Smut': '36',
    'Sports': '37',
    'Supernatural': '38',
    'Tragedy': '39',
    'Webtoons': '40',
    'Yaoi': '41',
    'Yuri': '42',
}

const generateURL = keyword => `https://mangakakalot.com/search/story/${keyword.replace(/[^a-zA-Z0-9]/g, '_')}`;
const splitAltTitles = titles => titles.split(titles.match(/,+/g) ? ',' : ';').map(title => title.trim());

class MangaKakalot {
    async chapterInfo(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            return {
                mangaTitle: $('h2:first').text().trim() || '',
                chapterTitle: $('.current-chapter').text().trim() || '',
                imageLinks: Array.from($('img').map((_, img) => $(img).attr('src')).get()) || [],
                chapterInfo: $('select.navi-change-chapter option:selected').text().trim().replace(/\d+$/, '').trim() || '',
                prevChapterLink: $('.btn-navigation-chap .next').attr('href') || '',
                description: $('.info-top-chapter p').eq(1).text().trim() || '',
                serverOptions: Array.from($('.panel-option .pn-op-sv-img-btn').map((_, option) => $(option).attr('data-l')).get()) || [],
                contentMargin: $('.panel-option .pn-op-sv-cbb-content-margin').val().trim() || '',
            };
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async chapterList(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            return $('.chapter-list .row').map((_, el) => ({
                chapterName: $(el).find('span a').text() || '',
                chapterLink: $(el).find('span a').attr('href') || '',
                views: $(el).find('span').eq(1).text() || '',
                timeUploaded: convertToDate($(el).find('span').eq(2).attr('title')) || '',
            })).get();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async chapterSearch(q) {
        const url = 'https://mangakakalot.com/search/story/' + q;
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            return $('.daily-update .story_item').map((_, el) => ({
                title: $(el).find('.story_name a').text().trim() || '',
                link: $(el).find('.story_name a').attr('href') || '',
                chapter: $(el).find('.story_chapter a').first().text().trim() || '',
                author: $(el).find('span').filter((_, el) => $(el).text().includes('Author(s)')).text().replace('Author(s) : ', '').trim() || '',
                updated: convertToDate($(el).find('span').filter((_, el) => $(el).text().includes('Updated')).text().replace('Updated : ', '').trim()) || '',
                views: $(el).find('span').filter((_, el) => $(el).text().includes('View')).text().replace('View : ', '').trim() || '',
            })).get();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async search(keyword) {
        try {
            const response = await fetch(generateURL(keyword));
            const html = await response.text();
            const $ = cheerio.load(html);
            const authors = [];
            const views = [];
            const updatedAt = [];

            const links = $('div.story_item > div.story_item_right > h3.story_name > a')
                .map((index, element) => {
                    const link = $(element).attr('href');
                    if (typeof link !== 'undefined') return link;
                })
                .get();

            const titles = $('div.story_item > div.story_item_right > h3.story_name > a')
                .map((index, element) => {
                    const title = $(element).text();
                    if (typeof title !== 'undefined') return title;
                })
                .get();

            const coverImage = $('div.story_item > a[rel="nofollow"] > img')
                .map((index, element) => $(element).attr('src') ?? '')
                .get();

            $('div.story_item > div.story_item_right > span').each((index, element) => {
                const attribute = $(element).text();
                if (typeof attribute === 'undefined') return;
                if (attribute.startsWith('Author(s) :')) authors.push(attribute.substring(12).split(','));
                if (attribute.startsWith('Updated :')) updatedAt.push(convertToDate(attribute.substring(10)));
                if (attribute.startsWith('View :')) views.push(attribute.substring(7));
            });

            const mangaList = new Array(titles.length)
                .fill('')
                .map((_, index) => ({
                    title: titles[index],
                    url: links[index],
                    authors: authors[index],
                    updatedAt: updatedAt[index],
                    views: views[index],
                    coverImage: coverImage[index],
                }))
                .filter((manga) => !manga.url.startsWith('https://readmanganato.com/'));

            return mangaList || [];
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getMangaMeta(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            let status;
            let updatedAt = new Date();
            let views = '';

            const chaptersViews = [];
            const chaptersDate = [];

            const mainTitle = $('h1').text();

            const altTitles = $('div.manga-info-top > ul.manga-info-text > li > h2.story-alternative')
                .map((_, element) => splitAltTitles($(element).text().substring(14)))
                .get();

            $('div.manga-info-top > ul > li').each((_, element) => {
                const unknownLi = $(element).text();
                if (unknownLi.startsWith('Status :')) status = unknownLi.substring(9).toLowerCase();
                if (unknownLi.startsWith('Last updated :')) updatedAt = new Date(unknownLi.substring(15));
                if (unknownLi.startsWith('View :')) views = unknownLi.substring(7);
            });

            const authors = $('div.manga-info-top > ul > li:contains("Author(s)") > a')
                .map((_, element) => $(element).text())
                .get();

            const genres = $('div.manga-info-top > ul > li:contains("Genres") > a')
                .map((_, element) => $(element).text())
                .get();

            const ratingText = $('div.manga-info-top > ul > li[style="line-height: 20px; font-size: 11px; font-style: italic; padding: 0px 0px 0px 44px;"] > em#rate_row_cmd').text();
            const stringArr = ratingText.split(' ');
            const src = stringArr[0].trim();
            const voteCount = Number(stringArr[7]).toLocaleString();
            const ratingStars = `${stringArr[3]} / ${stringArr[5]}`;
            const ratingPercentage = `${((Number(stringArr[3]) / Number(stringArr[5])) * 100).toFixed(2)}%`;

            const rating = {
                sourceRating: src,
                voteCount,
                ratingPercentage,
                ratingStars
            };

            const summary = $('div#noidungm').clone().children().remove().end().text().trim();

            const coverImage = $('div.manga-info-top > div.manga-info-pic > img').attr('src') ?? '';

            const chapterDiv = $('div.manga-info-chapter > div.chapter-list > div.row');

            const chaptersNameURL = chapterDiv
                .find('span > a')
                .map((_, element) => {
                    const chapterName = $(element).text();
                    const chapterURL = $(element).attr('href') ?? '';
                    return {
                        name: chapterName,
                        url: chapterURL
                    };
                })
                .get();

            chapterDiv.children('span:not(:has(a))').each((_, element) => {
                const chaptersViewDate = $(element).text();
                if (chaptersViewDate.match(/[a-zA-Z]/g)) chaptersDate.push(convertToDate(chaptersViewDate));
                else chaptersViews.push(chaptersViewDate);
            });

            const chapters = chapterDiv
                .map((index) => ({
                    name: chaptersNameURL[index].name,
                    url: chaptersNameURL[index].url,
                    uploadDate: chaptersDate[index],
                    views: chaptersViews[index],
                }))
                .get();

            return {
                title: {
                    main: mainTitle,
                    alt: altTitles
                },
                status,
                updatedAt: convertToDate(updatedAt),
                views,
                authors,
                genres: genres,
                rating,
                summary,
                coverImage,
                chapters,
            } || {};
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getMangasFromGenre(genre = 'any', filters = {}) {
        const {
            page = 1, status = 'any', type = 'updated'
        } = filters;
        const url = `https://mangakakalot.com/manga_list?type=${type === 'updated' ? 'latest' : 'newest'}&category=${
            genre != null && genre !== 'any' ? MangakakalotGenres[genre] : ''
          }&state=${status === 'any' ? 'all' : status}&page=${page}`;
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const titleURLs = $('div.list-truyen-item-wrap > h3 > a')
                .map((_, element) => {
                    const anchorEl = $(element);
                    const title = anchorEl.text();
                    const url = anchorEl.attr('href') ?? '';
                    return {
                        title,
                        url
                    };
                })
                .get();

            const views = $('div.list-truyen-item-wrap > div > span.aye_icon')
                .map((_, element) => $(element).text())
                .get();

            const covers = $('div.list-truyen-item-wrap > a > img')
                .map((_, element) => $(element).attr('src') ?? '')
                .get();

            const mangaList = titleURLs
                .map(({
                    title,
                    url
                }, i) => ({
                    title,
                    url,
                    views: views[i],
                    coverImage: covers[i],
                }))
                .filter((manga) => !manga.url.startsWith('https://readmanganato.com/'));

            return mangaList || [];
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getPages(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);
            const pages = $('div.container-chapter-reader > img[src]')
                .map((_, element) => $(element).attr('src'))
                .get();

            return pages || [];
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async getMangasPdf(imageSources) {
        const headers = {
            'User-Agent': fakeUserAgent(),
            'Referer': 'https://mangakakalot.com/',
            'Cookie': '__cfduid=d92a49507fe881e99fffddfad020ecb271612495383',
        };
        try {
            const buffers = [];
            const pdfDoc = new PDFDocument();
            const pdfStream = new PassThrough();
            pdfDoc.pipe(pdfStream);

            if (!imageSources || imageSources.length === 0) {
                console.log('No images found.');
                return null;
            }

            for (const [index, imageSource] of imageSources.entries()) {
                try {
                    let imageData;

                    if (typeof imageSource === 'string') {
                        const imageResponse = await (await fetch(imageSource, {
                            headers
                        })).arrayBuffer();
                        imageData = Buffer.from(imageResponse);
                    } else if (Buffer.isBuffer(imageSource)) {
                        imageData = imageSource;
                    } else {
                        console.error(`Invalid image source at index ${index + 1}`);
                        continue;
                    }

                    await pdfDoc.addPage().image(imageData, {
                        fit: [pdfDoc.page.width, pdfDoc.page.height],
                    });
                } catch (error) {
                    console.error(`Error processing image at index ${index + 1}:`, error);
                }
            }

            pdfDoc.end();

            pdfStream.on('data', (chunk) => buffers.push(chunk));

            return new Promise((resolve) => pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

}

export {
    MangaKakalot
};