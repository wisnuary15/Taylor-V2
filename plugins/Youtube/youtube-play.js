import fetch from "node-fetch";
import yts from "yt-search";
const handler = async (m, {
  conn,
  command,
  args,
  usedPrefix
}) => {
  try {
    const text = args.length >= 1 ? args.join(" ") : m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description) || null;
    if (!text) return m.reply(`Masukkan teks atau balas pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    const isMP3 = /^(play|ytplay|ytmp3|playmp3)$/i.test(command);
    m.react(wait);
    let vid = await ytsearch(text);
    if (!vid || !vid.url) throw new Error("Video tidak ditemukan. Silakan coba kata kunci lain.");
    const {
      title = "Tidak Diketahui",
        thumbnail,
        timestamp = "Tidak Diketahui",
        views = "Tidak Diketahui",
        ago = "Tidak Diketahui",
        url
    } = vid;
    const captvid = `📺 *Judul:* ${title}\n⌛ *Durasi:* ${timestamp}\n👀 *Views:* ${views}\n📅 *Upload:* ${ago}\n🔗 *Link:* ${url}`;
    const ytthumb = (await conn.getFile(thumbnail))?.data;
    const dla = `Mengunduh ${isMP3 ? "audio" : "video"}, harap tunggu...`;
    const dls = isMP3 ? "Berhasil memutar audio" : "Berhasil memutar video";
    const infoReply = {
      contextInfo: {
        externalAdReply: {
          body: dla,
          mediaType: isMP3 ? 1 : 2,
          mediaUrl: url,
          previewType: 0,
          renderLargerThumbnail: !0,
          sourceUrl: url,
          thumbnail: ytthumb,
          title: `Y O U T U B E - ${isMP3 ? "A U D I O" : "V I D E O"}`
        }
      }
    };
    await conn.reply(m.chat, captvid, m, infoReply);
    infoReply.contextInfo.externalAdReply.body = dls;
    let data = await ytdl(url);
    const doc = {
      [isMP3 ? "audio" : "video"]: (await conn.getFile(data))?.data,
      caption: captvid,
      mimetype: isMP3 ? "audio/mp4" : "video/mp4",
      filename: title,
      contextInfo: infoReply.contextInfo
    };
    await conn.sendMessage(m.chat, doc, {
      quoted: m
    });
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["play"].map(v => v + " <pencarian>"), handler.tags = ["downloader"],
  handler.command = /^(play|ytplay|ytmp3|playmp3|playmp4|ytplaymp4)$/i, handler.limit = !0;
export default handler;
async function ytdl(link, itag = "360") {
  try {
    const videoId = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=))([a-zA-Z0-9_-]{11})/)?.[1] || (link.length === 11 && !link.includes("http") ? link : null);
    if (!videoId) throw new Error("Invalid video ID");
    const data = await (await fetch(`https://yt-dlp-api.peterli.website/video/?video_url=https://www.youtube.com/watch?v=${videoId}`)).json();
    return data.links?.find(link => link.itag === itag)?.url || data.links?.[0]?.url || null;
  } catch (error) {
    throw error;
  }
}
async function ytsearch(query, maxResults = 5, similarityThreshold = .5) {
  try {
    const res = await yts(query);
    const videos = res.videos.slice(0, maxResults).filter(video => {
      const titleWords = video.title.toLowerCase().split(" ");
      const queryWords = query.toLowerCase().split(" ");
      const matchedWords = titleWords.filter(word => queryWords.includes(word));
      const similarity = matchedWords.length / titleWords.length;
      return similarity >= similarityThreshold || matchedWords.length >= queryWords.length - 1;
    });
    return videos.length > 0 ? videos[0] : {};
  } catch (e) {
    console.error(e);
    return {};
  }
}
