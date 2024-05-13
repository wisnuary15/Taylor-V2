import {
    youtubedl,
    youtubedlv2
} from "@bochilteam/scraper";

const limit = 80;

export async function before(m) {
if (m.isBaileys || !m.text) return false;
    const regex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/;
    const matches = m.text.trim().match(regex);
    const chat = global.db.data.chats[m.chat];
    const spas = "                ";

    if (!matches || !matches[0] || chat.autodlYoutube !== true) return;

    await m.reply(wait);

    try {
        const q = "360p";
        const v = matches[0];
        const yt = await youtubedl(v).catch(async () => await youtubedlv2(v));
        const dl_url = await yt.video[q].download();
        const title = await yt.title;
        const size = await yt.video[q].fileSizeH;

        if (size.split("MB")[0] >= limit) {
            return m.reply(` ≡  *Youtube Downloader*\n\n▢ *⚖️Size* : ${size}\n▢ *🎞️quality* : ${q}\n\n▢ _The file exceeds the download limit_ *+${limit} MB*`);
        }

        const captvid = `
 ≡  *Youtube Downloader*
  
▢ *📌Títle* : ${title}
▢ *📟 Ext* : mp4
▢ *🎞️Quality* : ${q}
▢ *⚖️Size* : ${size}
`.trim();

        const dls = "Downloading audio succes";
        const doc = {
            video: {
                url: dl_url
            },
            mimetype: "video/mp4",
            caption: captvid,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: v,
                    title: title,
                    body: dls,
                    sourceUrl: v,
                    thumbnail: await (await this.getFile(yt.thumbnail)).data
                }
            }
        };

        await this.sendMessage(m.chat, doc, {
            quoted: m
        });
    } catch (e) {}
}

export const disabled = false;