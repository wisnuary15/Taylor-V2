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
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  const isMP3 = /^(play|ytplay|ytmp3|playmp3|playmp4|ytplaymp4)$/i.test(command);
  try {
    let vid = await searchAndFilterVideos(text);
    if (!vid) throw "Video Not Found, Try Another Title";
    let {
      title = "tidak diketahui",
        thumbnail,
        timestamp = "tidak diketahui",
        views = "tidak diketahui",
        ago = "tidak diketahui",
        url
    } = vid, captvid = `📺 *Title:* ${title}\n⌛ *Duration:* ${timestamp}\n👀 *Views:* ${formatNumber(views)}\n📅 *Upload:* ${ago}\n🔗 *Link:* ${url}\n${wait}`, ytthumb = await conn.getFile(thumbnail)?.data ?? "", dla = "Downloading audio please wait", dls = isMP3 ? "Play audio succes" : "Play video succes", msg = await generateWAMessageFromContent(m.chat, {
      extendedTextMessage: {
        text: captvid,
        jpegThumbnail: ytthumb,
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            body: dla,
            containsAutoReply: !0,
            mediaType: 1,
            mediaUrl: url,
            renderLargerThumbnail: !0,
            showAdAttribution: !0,
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
    if (await conn.relayMessage(m.chat, msg.message, {}), isMP3) {
      let Ytdl = await ytmp3(url),
        ytthumb = await conn.getFile(Ytdl.meta.image)?.data ?? "",
        doc = {
          audio: Ytdl.buffer,
          mimetype: "audio/mp4",
          fileName: Ytdl.meta.title,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: !0,
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
      let q = args[1] || "360p",
        item = await ytmp4(url, q.split("p")[0]),
        captvid = `🔍 *[ RESULT ]*\n📷 *Image URL:* ${item.thumb?.url ?? "Tidak diketahui"}\n📚 *Title:* ${item.title ?? "Tidak diketahui"}\n📅 *Date:* ${item.date ?? "Tidak diketahui"}\n⏱️ *Duration:* ${item.duration ?? "Tidak diketahui"}\n📺 *Channel:* ${item.channel ?? "Tidak diketahui"}\n🔒 *Quality:* ${item.quality ?? "Tidak diketahui"}\n📦 *Content Length:* ${item.contentLength ?? "Tidak diketahui"}\n📝 *Description:* ${item.description ?? "Tidak diketahui"}`,
        doc = {
          video: {
            url: item.videoUrl
          },
          mimetype: "video/mp4",
          caption: captvid,
          contextInfo: {
            externalAdReply: {
              showAdAttribution: !0,
              mediaType: 2,
              mediaUrl: url,
              title: item.title,
              body: dls,
              sourceUrl: url,
              thumbnail: await conn.getFile(item.image)?.data ?? ""
            }
          }
        };
      await conn.sendMessage(m.chat, doc, {
        quoted: m
      });
    }
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["play"].map(v => v + " <pencarian>"), handler.tags = ["downloader"],
  handler.command = /^(play|ytplay|ytmp3|playmp3|playmp4|ytplaymp4)$/i, handler.limit = !0;
export default handler;

function formatNumber(num) {
  const numString = Math.abs(num).toString(),
    numDigits = numString.length;
  if (numDigits <= 3) return numString;
  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1e3, suffixIndex)).toFixed(1);
  return formattedNum.endsWith(".0") && (formattedNum = formattedNum.slice(0, -2)),
    formattedNum + ["", "k", "M", "B", "T"][suffixIndex];
}
async function searchAndFilterVideos(query, maxResults = 100, similarityThreshold = .5) {
  try {
    const res = await yts(query),
      videos = res.videos.slice(0, maxResults).filter(video => {
        const titleWords = video.title.toLowerCase().split(" "),
          queryWords = query.toLowerCase().split(" ");
        return titleWords.filter(word => queryWords.includes(word)).length / titleWords.length >= similarityThreshold;
      });
    return videos.length > 0 ? videos[0] : res.videos.length > 0 ? res.videos[0] : {};
  } catch (e) {
    return console.error(e), {};
  }
}
async function ytmp3(url) {
  try {
    const {
      videoDetails
    } = await ytdl.getInfo(url, {
      lang: "id"
    }), stream = ytdl(url, {
      filter: "audioonly",
      quality: 140
    }), chunks = [];
    stream.on("data", chunk => {
      chunks.push(chunk);
    }), await new Promise((resolve, reject) => {
      stream.on("end", resolve), stream.on("error", reject);
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
  const hours = Math.floor(seconds / 3600),
    minutes = Math.floor(seconds % 3600 / 60),
    remainingSeconds = seconds % 60,
    formattedDuration = [];
  return hours > 0 && formattedDuration.push(`${hours} hour`), minutes > 0 && formattedDuration.push(`${minutes} minute`),
    remainingSeconds > 0 && formattedDuration.push(`${remainingSeconds} second`),
    formattedDuration.join(" ");
}

function formatBytes(bytes) {
  if (0 === bytes) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${[ "B", "KB", "MB", "GB", "TB" ][i]}`;
}
async function ytmp4(query, quality = 134) {
  try {
    const videoInfo = await ytdl.getInfo(query, {
        lang: "id"
      }),
      format = ytdl.chooseFormat(videoInfo.formats, {
        format: quality,
        filter: "videoandaudio"
      });
    let contentLength = (await fetch(format.url, {
        method: "HEAD"
      })).headers.get("content-length"),
      fileSizeInBytes = parseInt(contentLength);
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
