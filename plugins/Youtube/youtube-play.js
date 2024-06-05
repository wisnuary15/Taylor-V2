import fetch from "node-fetch";
import ytdl from "ytdl-core";
import yts from "yt-search";
import {
    generateWAMessageFromContent
} from "@whiskeysockets/baileys";
let limit = 80;
const handler = async (m, {
    conn,
    command,
    args,
    usedPrefix
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    const combinedRegex = /^(play|ytplay|ytmp3|playmp3|playmp4|ytplaymp4)$/i;
    const isMP3 = combinedRegex.test(command);
    try {
        let vid = await searchAndFilterVideos(text);
        if (!vid) throw "Video Not Found, Try Another Title";
        let {
            title = 'tidak diketahui',
                thumbnail,
                timestamp = 'tidak diketahui',
                views = 'tidak diketahui',
                ago = 'tidak diketahui',
                url
        } = vid;
        let captvid = `📺 *Title:* ${title}\n⌛ *Duration:* ${timestamp}\n👀 *Views:* ${formatNumber(views)}\n📅 *Upload:* ${ago}\n🔗 *Link:* ${url}\n${wait}`;
        let ytthumb = await (await conn.getFile(thumbnail)?.data) ?? '';
        let dla = "Downloading audio please wait";
        let dls = isMP3 ? "Play audio succes" : "Play video succes";
        let msg = await generateWAMessageFromContent(m.chat, {
            extendedTextMessage: {
                text: captvid,
                jpegThumbnail: ytthumb,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        body: dla,
                        containsAutoReply: true,
                        mediaType: 1,
                        mediaUrl: url,
                        renderLargerThumbnail: true,
                        showAdAttribution: true,
                        sourceId: "WudySoft",
                        sourceType: "PDF",
                        previewType: "PDF",
                        sourceUrl: url,
                        thumbnail: ytthumb,
                        thumbnailUrl: thumbnail,
                        title: htki + " Y O U T U B E " + htka
                    }
                }
            }
        }, {
            quoted: m
        });
        await conn.relayMessage(m.chat, msg.message, {});
        if (isMP3) {
            let Ytdl = await ytmp3(url);
            let ytthumb = await (await conn.getFile(Ytdl.meta.image)?.data) ?? '';
            let doc = {
                audio: Ytdl.buffer,
                mimetype: "audio/mp4",
                fileName: Ytdl.meta.title,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: url,
                        title: Ytdl.meta.title,
                        body: dls,
                        sourceUrl: url,
                        thumbnail: ytthumb
                    }
                }
            };
            await conn.sendMessage(m.chat, doc, {
                quoted: m
            });
        } else {
            let q = args[1] || "360p";
            let item = await ytmp4(url, q.split("p")[0]);
            let captvid = `🔍 *[ RESULT ]*\n📷 *Image URL:* ${item.thumb?.url ?? 'Tidak diketahui'}\n📚 *Title:* ${item.title ?? 'Tidak diketahui'}\n📅 *Date:* ${item.date ?? 'Tidak diketahui'}\n⏱️ *Duration:* ${item.duration ?? 'Tidak diketahui'}\n📺 *Channel:* ${item.channel ?? 'Tidak diketahui'}\n🔒 *Quality:* ${item.quality ?? 'Tidak diketahui'}\n📦 *Content Length:* ${item.contentLength ?? 'Tidak diketahui'}\n📝 *Description:* ${item.description ?? 'Tidak diketahui'}`;
            let doc = {
                video: {
                    url: item.videoUrl
                },
                mimetype: "video/mp4",
                caption: captvid,
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 2,
                        mediaUrl: url,
                        title: item.title,
                        body: dls,
                        sourceUrl: url,
                        thumbnail: await (await conn.getFile(item.image)?.data) ?? ''
                    }
                }
            };
            await conn.sendMessage(m.chat, doc, {
                quoted: m
            });
        }
    } catch (e) {
        m.reply(eror);
    }
};
handler.help = ["play"]?.map(v => v + " <pencarian>");
handler.tags = ["downloader"];
handler.command = /^(play|ytplay|ytmp3|playmp3|playmp4|ytplaymp4)$/i;
handler.limit = true;
export default handler;

function formatNumber(num) {
    const suffixes = ['', 'k', 'M', 'B', 'T'];
    const numString = Math.abs(num).toString();
    const numDigits = numString.length;
    if (numDigits <= 3) {
        return numString;
    }
    const suffixIndex = Math.floor((numDigits - 1) / 3);
    let formattedNum = (num / Math.pow(1000, suffixIndex)).toFixed(1);
    if (formattedNum.endsWith('.0')) {
        formattedNum = formattedNum.slice(0, -2);
    }
    return formattedNum + suffixes[suffixIndex];
}
async function searchAndFilterVideos(query, maxResults = 100, similarityThreshold = 0.5) {
    try {
        const res = await yts(query);
        const videos = res.videos.slice(0, maxResults)?.filter(video => {
            const titleWords = video.title.toLowerCase().split(" ");
            const queryWords = query.toLowerCase().split(" ");
            const matchCount = titleWords?.filter(word => queryWords.includes(word)).length;
            return matchCount / titleWords.length >= similarityThreshold;
        });
        return videos.length > 0 ? videos[0] : (res.videos.length > 0 ? res.videos[0] : {});
    } catch (e) {
        console.error(e);
        return {};
    }
}
async function ytmp3(url) {
    try {
        const {
            videoDetails
        } = await ytdl.getInfo(url, {
            lang: "id"
        });
        const stream = ytdl(url, {
            filter: "audioonly",
            quality: 140
        });
        const chunks = [];
        stream.on("data", chunk => {
            chunks.push(chunk);
        });
        await new Promise((resolve, reject) => {
            stream.on("end", resolve);
            stream.on("error", reject);
        });
        const buffer = Buffer.concat(chunks);
        return {
            meta: {
                title: videoDetails.title,
                channel: videoDetails.author.name,
                seconds: videoDetails.lengthSeconds,
                description: videoDetails.description,
                image: videoDetails.thumbnails.slice(-1)[0]?.url
            },
            buffer: buffer,
            size: buffer.length
        };
    } catch (error) {
        throw error;
    }
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedDuration = [];
    if (hours > 0) {
        formattedDuration.push(`${hours} hour`);
    }
    if (minutes > 0) {
        formattedDuration.push(`${minutes} minute`);
    }
    if (remainingSeconds > 0) {
        formattedDuration.push(`${remainingSeconds} second`);
    }
    return formattedDuration.join(' ');
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`;
}
async function ytmp4(query, quality = 134) {
    try {
        const videoInfo = await ytdl.getInfo(query, {
            lang: 'id'
        });
        const format = ytdl.chooseFormat(videoInfo.formats, {
            format: quality,
            filter: 'videoandaudio'
        });
        let response = await fetch(format.url, {
            method: 'HEAD'
        });
        let contentLength = response.headers.get('content-length');
        let fileSizeInBytes = parseInt(contentLength);
        return {
            title: videoInfo.videoDetails.title,
            thumb: videoInfo.videoDetails.thumbnails.slice(-1)[0],
            date: videoInfo.videoDetails.publishDate,
            duration: formatDuration(videoInfo.videoDetails.lengthSeconds),
            channel: videoInfo.videoDetails.ownerChannelName,
            quality: format.qualityLabel,
            contentLength: formatBytes(fileSizeInBytes),
            description: videoInfo.videoDetails.description,
            videoUrl: format.url
        };
    } catch (error) {
        throw error;
    }
}
