import {
    fetch as fetchUndici
} from 'undici';
import got from 'got';
import fetch from 'node-fetch';
import axios from 'axios';
import {
    format
} from 'util';
import userAgent from 'fake-useragent';
import {
    sizeFormatter,
    durationFormatter
} from 'human-readable';
import {
    createHash
} from 'crypto';
import urlRegexSafe from 'url-regex-safe';
import {
    delay
} from '@whiskeysockets/baileys';

const resultsMap = new Map();
const formatSize = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
});
const formatDuration = durationFormatter({
    allowMultiples: ['d', 'h', 'm', 's'],
    keepNonLeadingZeroes: false
});
const MAX_TOTAL_LINKS = 1 * 10;
const MAX_CONTENT_SIZE = 1 * 1024 * 1024 * 1024;
const DELAY_TIME = 1 * 1024;
const MAX_TEXT_LENGTH = 1 * 65536;
const urlRegexOptions = {
    localhost: true,
    ipv4: true,
    ipv6: true
};

const isTextContent = (contentType) => /^(text\/(plain|html|xml)|application\/(json|.*\+xml)|.*\/(javascript|xml|x-www-form-urlencoded))/.test(contentType);

const normalizeUrl = (url) => url.match(/^(https?|http):\/\//) ? url : `https://${url.replace(/^\/\/(.+)/, '$1')}`;

const fetchers = [{
        lib: fetchUndici,
        options: {
            redirect: 'follow'
        }
    },
    {
        lib: got,
        options: {
            followRedirect: true,
            maxRedirects: 5
        }
    },
    {
        lib: fetch,
        options: {
            redirect: 'follow'
        }
    },
    {
        lib: axios,
        options: {
            maxRedirects: 5,
            validateStatus: null
        }
    }
];

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        const startTime = Date.now();
        const inputText = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

        if (!inputText) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} ${logo}*`);
        const totalLinks = [...new Set([...inputText.matchAll(urlRegexSafe(urlRegexOptions))].map(match => normalizeUrl(match[0])))].filter(Boolean);

        const fetchLink = async (url, origin) => {
            let link, response, contentType, contentDisposition, contentLength, txt;
            for (const fetcher of fetchers) {
                try {
                    ({
                        href: link,
                        origin
                    } = new URL(normalizeUrl(url)));
                    const headers = {
                        Referer: origin,
                        'User-Agent': userAgent(),
                        'DNT': 1,
                        'Upgrade-Insecure-Request': 1
                    };
                    response = await fetcher.lib(link, {
                        ...fetcher.options,
                        headers
                    });
                    contentType = response.headers.get('content-type');
                    contentDisposition = response.headers.get('content-disposition');
                    contentLength = response.headers.get('content-length');
                    txt = fetcher.lib === got ? response.body : fetcher.lib === axios ? response.data : await response.text();
                    break;
                } catch (error) {
                    console.error(`Error fetching link: ${url}`, error);
                    continue;
                }
            }
            if (!txt || !txt.trim()) {
                m.reply(`Empty result for link: ${url}`);
                return;
            }
            const uniqueId = createHash('sha256').update(url + uniqueIdCounter++).digest('hex');
            resultsMap.set(uniqueId, {
                link,
                contentType,
                contentDisposition,
                contentLength,
                txt
            });
            const maxContentLength = Math.max(parseInt(contentLength, 10) || (txt && txt.length) || 0);
            if (maxContentLength > MAX_CONTENT_SIZE) {
                m.reply(`File terlalu besar. Ukuran maksimum adalah ${formatSize(MAX_CONTENT_SIZE)}`);
                return;
            }
            successCount++;
        };

        let successCount = 0,
            errorCount = 0,
            mediaCount = 0,
            replyCount = 0,
            uniqueIdCounter = 1;

        if (totalLinks.length === 0) return m.reply('Tidak ada link atau alamat IP yang ditemukan.');
        if (totalLinks.length > MAX_TOTAL_LINKS) return m.reply(`Link terlalu banyak. Hanya maksimal ${MAX_TOTAL_LINKS} link yang diizinkan.`);

        for (const url of totalLinks) {
            await fetchLink(url);
        }

        for (const [id, {
                link,
                contentType,
                contentDisposition,
                contentLength,
                txt
            }] of resultsMap) {
            let finalContentLength = parseInt(contentLength, 10) || (txt.length !== null && txt.length !== undefined ? txt.length : 0);
            let finalContentType = contentType && contentType.split(';')[0].trim() || '';
            let finalContentDisposition = contentDisposition && contentDisposition.match(/filename[^;=\n]*=(["']?)(.*?)\1/)?.[2] || '';

            if (isTextContent(finalContentType)) {
                if (finalContentLength > MAX_TEXT_LENGTH) {
                    mediaCount++;
                    await delay(DELAY_TIME);
                    const caption = `🔗 *Link:* ${link}\n📄 *Type:* ${finalContentType}\n📊 *Size:* ${formatSize(finalContentLength)}`;
                    await conn.sendFile(m.chat, Buffer.from(txt), finalContentDisposition || finalContentType || 'Tidak diketahui', caption, m);
                } else {
                    replyCount++;
                    await delay(DELAY_TIME);
                    let parsedTxt;
                    try {
                        parsedTxt = format(JSON.parse(txt + ''));
                    } catch (jsonError) {
                        parsedTxt = txt + '';
                    } finally {
                        m.reply(parsedTxt.slice(0, MAX_TEXT_LENGTH) + '');
                    }
                }
            } else {
                mediaCount++;
                await delay(DELAY_TIME);
                const caption = `🔗 *Link:* ${link}\n📄 *Type:* ${finalContentType}\n📊 *Size:* ${formatSize(finalContentLength)}`;
                await conn.sendFile(m.chat, link, finalContentDisposition || finalContentType || 'Tidak diketahui', caption, m);
            }
        }

        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const formattedTime = formatDuration(elapsedTime * 1000);

        const completionMessage =
            successCount === totalLinks.length ?
            `Fetching completed in *${formattedTime}*. Successfully fetched *${successCount}* out of *${totalLinks.length}* links.\n📝 *Replies Sent:* ${replyCount}\n📈 *Media Sent:* ${mediaCount}` :
            `Fetching completed in *${formattedTime}*. Successfully fetched *${successCount}* out of *${totalLinks.length}* links. Failed to fetch *${errorCount}* links.\n📝 *Replies Sent:* ${replyCount}\n📈 *Media Sent:* ${mediaCount}`;

        m.reply(completionMessage);
        resultsMap.clear();
    } catch (e) {
        throw e;
    }
};
handler.help = ['get', 'fetch'];
handler.tags = ['tools'];
handler.alias = ['get', 'fetch'];
handler.command = ['get', 'fetch'];

export default handler;