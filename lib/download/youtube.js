import axios from "axios";
import * as cheerio from "cheerio";
import ytdl from "ytdl-core";
import fetch from "node-fetch";
import yts from "yt-search";
async function ytshort(Url, type = "mp4") {
  let {
    data: html
  } = await axios.post("https://ytdownloadid.herokuapp.com/download", {
    "choices-single-default": "mp4" === format ? "Mp4 / Video" : "Mp3 / Audio",
    url: Url
  });
  return cheerio.load(html)("div.s003 > div.first-wrap > button").attr("onclick").split(" = ")[1].replace(/[\"]/g, "");
}
async function ytmp4(url) {
  return new Promise((resolve, reject) => {
    try {
      const id = ytdl.getVideoID(url);
      const yutub = ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`).then(data => {
        let pormat = data.formats;
        let video = [];
        for (let i = 0; i < pormat.length; i++) {
          if (pormat[i].container == "mp4" && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
            let vid = pormat[i];
            video.push(vid.url);
          }
        }
        const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText;
        const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
        const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName;
        const views = data.player_response.microformat.playerMicroformatRenderer.viewCount;
        const published = data.player_response.microformat.playerMicroformatRenderer.publishDate;
        const duration = data.player_response.lengthSeconds;
        const result = {
          title: title,
          duration: duration,
          thumb: thumb,
          channel: channel,
          published: published,
          views: views,
          url: video[0]
        };
        return result;
      });
      resolve(yutub);
    } catch (error) {
      reject(error);
    }
    console.log(error);
  });
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
        image: videoDetails.thumbnails.slice(-1)[0].url
      },
      buffer: buffer,
      size: buffer.length
    };
  } catch (error) {
    throw error;
  }
}

function formatNumber(num) {
  const numString = Math.abs(num).toString(),
    numDigits = numString.length;
  if (numDigits <= 3) return numString;
  const suffixIndex = Math.floor((numDigits - 1) / 3);
  let formattedNum = (num / Math.pow(1e3, suffixIndex)).toFixed(1);
  return formattedNum.endsWith(".0") && (formattedNum = formattedNum.slice(0, -2)),
    formattedNum + ["", "k", "M", "B", "T"][suffixIndex];
}
async function ytsearch(query, maxResults = 100, similarityThreshold = .5) {
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
const videoId = url => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w\-]+)/);
  return match?.[1] ?? "VideoId tidak ditemukan";
};
const Ytdl = {
  search: async q => {
    try {
      const result = (await yts(q)).videos;
      return {
        status: true,
        data: result.map(({
          title,
          videoId,
          image,
          author
        }) => ({
          title: title,
          url: `https://youtu.be/${videoId}`,
          img: image,
          author: author
        }))
      };
    } catch {
      return {
        status: false,
        msg: "Data tidak dapat di temukan!"
      };
    }
  },
  mp4: async url => {
    try {
      const serverResponse = await fetch("https://proxy.ezmp3.cc/api/getServer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const {
        serverURL
      } = await serverResponse.json();
      const convertResponse = await fetch(`${serverURL}/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          quality: 128,
          trim: false,
          startT: 0,
          endT: 0,
          videoLength: 4,
          restricted: false,
          code: 0
        })
      });
      const {
        title = new Date().toISOString(),
          url: downloadUrl
      } = await convertResponse.json();
      const downloadResponse = await fetch("https://ssyoutube.com.co/mates/en/convert?id=YgEl3OEU2DA", {
        method: "POST",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
          "Sec-Ch-Ua-Mobile": "?1",
          "Sec-Ch-Ua-Platform": '"Android"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Referer: "https://ssyoutube.com.co/en111bv/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: `platform=youtube&url=${encodeURIComponent(url)}&title=${title}&id=YgEl3OEU2DA&ext=mp4&note=720p&format=136`
      });
      const downloadData = await downloadResponse.json();
      try {
        const headRes = await fetch(downloadUrl || downloadData.downloadUrlX, {
          method: "HEAD"
        });
        const contentType = headRes.headers.get("content-type");
        return headRes.ok && (contentType?.startsWith("video") || contentType?.startsWith("audio")) ? {
          url: downloadUrl || downloadData.downloadUrlX,
          buffer: Buffer.from(await fetch(downloadUrl || downloadData.downloadUrlX).then(res => res.arrayBuffer())),
          contentType: contentType,
          title: title
        } : null;
      } catch {
        return null;
      }
    } catch {
      return {
        status: false,
        msg: "Gagal saat mengambil data!"
      };
    }
  },
  mp3: async url => {
    try {
      const serverResponse = await fetch("https://proxy.ezmp3.cc/api/getServer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const {
        serverURL
      } = await serverResponse.json();
      const convertResponse = await fetch(`${serverURL}/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url,
          quality: 128,
          trim: false,
          startT: 0,
          endT: 0,
          videoLength: 4,
          restricted: false,
          code: 0
        })
      });
      const {
        title = new Date().toISOString(),
          url: downloadUrl
      } = await convertResponse.json();
      const downloadResponse = await fetch("https://ssyoutube.com.co/mates/en/convert?id=YgEl3OEU2DA", {
        method: "POST",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
          "Sec-Ch-Ua-Mobile": "?1",
          "Sec-Ch-Ua-Platform": '"Android"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          Referer: "https://ssyoutube.com.co/en111bv/",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        body: `platform=youtube&url=${encodeURIComponent(url)}&title=${title}&id=YgEl3OEU2DA&ext=mp4&note=720p&format=136`
      });
      const downloadData = await downloadResponse.json();
      try {
        const headRes = await fetch(downloadUrl || downloadData.downloadUrlX, {
          method: "HEAD"
        });
        const contentType = headRes.headers.get("content-type");
        return headRes.ok && (contentType?.startsWith("video") || contentType?.startsWith("audio")) ? {
          url: downloadUrl || downloadData.downloadUrlX,
          buffer: Buffer.from(await fetch(downloadUrl || downloadData.downloadUrlX).then(res => res.arrayBuffer())),
          contentType: contentType,
          title: title
        } : null;
      } catch {
        return null;
      }
    } catch {
      return {
        status: false,
        msg: "Gagal saat mengambil data!"
      };
    }
  }
};
export {
  ytmp4,
  ytmp3,
  formatNumber,
  ytsearch,
  ytshort,
  Ytdl
};