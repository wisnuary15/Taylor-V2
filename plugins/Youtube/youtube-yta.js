import {
  youtubedl,
  youtubedlv2
} from "@bochilteam/scraper";
import fetch from "node-fetch";
import ytdl from "ytdl-core";
const handler = async (m, {
  conn,
  args
}) => {
  if (!args[0]) throw "[Masukkan Url Youtube!]";
  m.react(wait);
  try {
    let Ytdl = await ytmp3(args[0]),
      dls = "Download audio success (V1)",
      ytthumb = await conn.getFile(Ytdl.meta.image)?.data || "",
      doc = {
        audio: Ytdl.buffer,
        mimetype: "audio/mp4",
        fileName: Ytdl.meta.title || "",
        contextInfo: {
          externalAdReply: {
            showAdAttribution: !0,
            mediaType: 2,
            mediaUrl: args[0],
            title: Ytdl.meta.title || "",
            body: dls,
            sourceUrl: args[0],
            thumbnail: ytthumb
          }
        }
      };
    await conn.sendMessage(m.chat, doc, {
      quoted: m
    });
  } catch {
    try {
      let yt = await youtubedlv2(args[0]).catch(async _ => await youtubedl(args[0])),
        link = await yt.audio["128kbps"].download(),
        ytl = "https://youtube.com/watch?v=",
        dls = "Download audio success (V2)",
        ytthumb = await conn.getFile(yt.thumbnail)?.data || "",
        doc = {
          audio: {
            url: link
          },
          mimetype: "audio/mp4",
          fileName: yt.title || "",
          contextInfo: {
            externalAdReply: {
              showAdAttribution: !0,
              mediaType: 2,
              mediaUrl: ytl + yt.id || "",
              title: yt.title || "",
              body: dls,
              sourceUrl: ytl + yt.id || "",
              thumbnail: ytthumb
            }
          }
        };
      await conn.sendMessage(m.chat, doc, {
        quoted: m
      });
    } catch {
      try {
        let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkey}&url=${args[0]}`),
          lolh = await lolhuman.json(),
          n = lolh.result.title || "error";
        await conn.sendMessage(m.chat, {
          audio: {
            url: lolh.result.link
          },
          fileName: `${n}.mp3`,
          mimetype: "audio/mp4"
        }, {
          quoted: m
        });
      } catch {
        m.reply(eror || "");
      }
    }
  }
};
handler.help = ["mp3", "a"].map(v => "yt" + v + "<url> <without message>"), handler.tags = ["downloader"],
  handler.command = /^y((outube|tb)audio|(outube|tb?)mp3|utubaudio|taudio|ta)$/i,
  handler.exp = 0, handler.register = !1, handler.limit = !0;
export default handler;
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
        title: videoDetails.title || "",
        channel: videoDetails.author.name || "",
        seconds: videoDetails.lengthSeconds || "",
        description: videoDetails.description || "",
        image: videoDetails.thumbnails.slice(-1)[0]?.url || ""
      },
      buffer: buffer,
      size: buffer.length
    };
  } catch (error) {
    throw error;
  }
}
