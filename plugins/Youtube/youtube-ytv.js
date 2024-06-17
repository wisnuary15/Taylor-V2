import { youtubedl, youtubedlv2 } from "@bochilteam/scraper";
import fetch from "node-fetch";
import ytdl from "ytdl-core";
let limit = 80;
const handler = async (m, { conn: conn, args: args, isPrems: isPrems, isOwner: isOwner, usedPrefix: usedPrefix, command: command }) => {
  if (!args || !args[0]) throw `✳️ Example :\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`;
  if (!args[0]?.match(/youtu/gi)) throw "❎ Verify that the YouTube link";
  let q = args[1] || "360p",
    v = args[0];
  m.react(wait);
  try {
    let item = await ytmp4(args[0], q.split("p")[0]);
    if ((item.contentLength.split("MB")[0] ?? 0) >= limit) return m.reply(` ≡  *YT Downloader V1*\n\n*⚖️Size* : ${item.contentLength}\n*🎞️Quality* : ${item.quality}\n\n_The file exceeds the download limit_ *+${limit} MB*\n\n*Link:*\n${await shortUrl(item.videoUrl)}`);
    let captvid = `🔍 *[ RESULT V1 ]*\n\n📷 *Image URL:* ${item.thumb?.url || "Tidak diketahui"}\n📚 *Title:* ${item.title || "Tidak diketahui"}\n📅 *Date:* ${item.date || "Tidak diketahui"}\n⏱️ *Duration:* ${item.duration || "Tidak diketahui"}\n📺 *Channel:* ${item.channel || "Tidak diketahui"}\n🔒 *Quality:* ${item.quality || "Tidak diketahui"}\n📦 *Content Length:* ${item.contentLength || "Tidak diketahui"}\n📝 *Description:* ${item.description || "Tidak diketahui"}\n`.trim(),
      dls = "Downloading video succes",
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
            mediaUrl: v,
            title: item.title,
            body: dls,
            sourceUrl: v,
            thumbnail: await (await conn.getFile(item.thumb?.url)).data
          }
        }
      };
    await conn.sendMessage(m.chat, doc, {
      quoted: m
    });
  } catch (error) {
    try {
      const yt = await (youtubedl(v)?.catch((async () => await youtubedlv2(v)))),
        dl_url = await (yt?.video[q].download()),
        title = await (yt?.title),
        size = await (yt?.video[q].fileSizeH);
      if ((size?.split("MB")[0] ?? 0) >= limit) return m.reply(` ≡  *YT Downloader V2*\n\n*⚖️Size* : ${size}\n*🎞️quality* : ${q}\n\n_The file exceeds the download limit_ *+${limit} MB*\n\n*Link:*\n${await shortUrl(dl_url)}`);
      let doc = {
        video: {
          url: dl_url
        },
        mimetype: "video/mp4",
        caption: `🔍 *[ RESULT V2 ]*\n  \n*📌Títle* : ${title || "Tidak diketahui"}\n*📟 Ext* : mp4\n*🎞️Quality* : ${q || "Tidak diketahui"}\n*⚖️Size* : ${size || "Tidak diketahui"}\n`.trim(),
        contextInfo: {
          externalAdReply: {
            showAdAttribution: !0,
            mediaType: 2,
            mediaUrl: v,
            title: title,
            body: "Downloading video succes",
            sourceUrl: v,
            thumbnail: await (await conn.getFile(yt?.thumbnail)).data
          }
        }
      };
      await conn.sendMessage(m.chat, doc, {
        quoted: m
      });
    } catch (e) {
      m.react(eror);
    }
  }
};
handler.help = ["mp4", "v", ""].map((v => "yt" + v + " <url> <without message>")),
  handler.tags = ["downloader"], handler.command = /^y(outube(mp4|vdl)|t((mp4|v)|vdl))$/i,
  handler.exp = 0, handler.register = !1, handler.limit = !0;
export default handler;
async function shortUrl(url) {
  try {
    let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
    return await res.text();
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
    remainingSeconds > 0 && formattedDuration.push(`${remainingSeconds} second`), formattedDuration.join(" ");
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