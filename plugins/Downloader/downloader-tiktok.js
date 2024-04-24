import axios from "axios"
import got from "got"
import {
    fetchVideo
} from "@prevter/tiktok-scraper"
import {
    Tiktok
} from "@xct007/tiktok-scraper"
import ora from 'ora';
import chalk from 'chalk';
import {
    TiktokJs
} from "../../lib/download/tiktok-js.js";
let tiktokJs = new TiktokJs();

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    let lister = Array.from({
        length: 15
    }, (_, index) => `v${index + 1}`);
    let [links, versions] = text.split(" ");
    let aca = ['v12', 'v14', 'v15'];
    versions = versions ? versions : aca[Math.floor(Math.random() * aca.length)];
    let spaces = "                ";
    if (!lister.includes(versions.toLowerCase())) return m.reply("*Example:*\n" + usedPrefix + command + " link v2\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v.toUpperCase()).join("\n"));

    try {

        if (!links) return m.reply("Input query link");

        if (versions == "v1") {
            let video = await tiktokJs.aweme(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.stats.total_views || ''}\n` +
                `💬 Comments: ${video.stats.total_comment || ''}\n` +
                `🔁 Shares: ${video.stats.total_share || ''}\n` +
                `▶️ Download: ${video.stats.total_download || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Aweme ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || video.videos[2] || giflogo, "", caption, m);
        }
        if (versions == "v2") {
            let video = await tiktokJs.musicaldown(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `🎵 Music: ${video.music.title || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Musicaldown ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || video.videos[2] || giflogo, "", caption, m);
        }
        if (versions == "v3") {
            let video = await tiktokJs.savetik(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `🎵 Music: ${video.music.title || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Savetik ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || video.videos[2] || giflogo, "", caption, m);
        }
        if (versions == "v4") {
            let video = await tiktokJs.snaptik(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Snaptik ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || video.videos[2] || giflogo, "", caption, m);
        }
        if (versions == "v5") {
            let video = await tiktokJs.snaptikpro(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Snaptikpro ]*`;

            await conn.sendFile(m.chat, video.videos || video.videos[0] || video.videos[1] || giflogo, "", caption, m);
        }
        if (versions == "v6") {
            let video = await tiktokJs.ssstik(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Ssstik ]*`;

            await conn.sendFile(m.chat, video.videos || video.videos[0] || video.videos[1] || giflogo, "", caption, m);
        }
        if (versions == "v7") {
            let video = await tiktokJs.tikcdn(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.stats.total_views || ''}\n` +
                `💬 Comments: ${video.stats.total_comment || ''}\n` +
                `🔁 Shares: ${video.stats.total_share || ''}\n` +
                `▶️ Download: ${video.stats.total_download || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Tikcdn ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || giflogo, "", caption, m);
        }
        if (versions == "v8") {
            let video = await tiktokJs.tikmate(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Tikmate ]*`;

            await conn.sendFile(m.chat, video.videos || video.videos[0] || giflogo, "", caption, m);
        }
        if (versions == "v9") {
            let video = await tiktokJs.tiktokdownloadr(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Tiktokdownloadr ]*`;

            await conn.sendFile(m.chat, video.videos[0] || video.videos[1] || video.videos[2] || giflogo, "", caption, m);
        }
        if (versions == "v10") {
            let video = await tiktokJs.tikwm(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.stats.total_views || ''}\n` +
                `💬 Comments: ${video.stats.total_comment || ''}\n` +
                `🔁 Shares: ${video.stats.total_share || ''}\n` +
                `▶️ Download: ${video.stats.total_download || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Tikwm ]*`;

            await conn.sendFile(m.chat, video.videos || video.videos[0] || giflogo, "", caption, m);
        }
        if (versions == "v11") {
            let video = await tiktokJs.ttdownloader(links);
            let caption = `${spaces}*[ T I K T O K ]*\n` +
                `🔗 ID: ${video.video_id || ''}\n` +
                `👤 Author: ${video.author.name || ''}\n` +
                `❤️ Views: ${video.total_views || ''}\n` +
                `💬 Comments: ${video.total_comment || ''}\n` +
                `🎵 Music: ${video.music.title} - ${video.music.author || ''}\n` +
                `🖼️ Thumbnail URL: ${video.thumbnail || ''}\n` +
                `${spaces}*[ Ttdownloader ]*`;

            await conn.sendFile(m.chat, video.videos || video.videos[0] || giflogo, "", caption, m);
        }
        if (versions == "v12") {
            let Scrap = await Tiktokdl(links)
            let S = Scrap.result
            let ScrapCap = `${spaces}*「 T I K T O K 」*

*📛 Author:* ${S.author.nickname}
*📒 Title:* ${S.desc}
\n${spaces}*[ ${versions.toUpperCase()} ]*`
            await conn.sendFile(m.chat, S.download.nowm, "", ScrapCap, m)
        }
        if (versions == "v13") {
            let god = await axios.get("https://godownloader.com/api/tiktok-no-watermark-free?url=" + links + "&key=godownloader.com")
            let GoCap = `${spaces}*[ T I K T O K ]*

*Desc:* ${god.data.desc}
\n${spaces}*[ ${versions.toUpperCase()} ]*`
            await conn.sendFile(m.chat, god.data.video_no_watermark, "", GoCap, m)
        }
        if (versions == "v14") {
            let spinner = ora({
                text: 'Downloading...',
                spinner: 'moon',
            }).start();
            try {
                let video = await fetchVideo(links);
                let buffer = await video.download({
                    progress: (p) => {
                        let progressText = chalk.blue(`Downloaded ${p.progress}%`) +
                            ` (${chalk.green(p.downloaded)}/${chalk.green(p.total)} bytes)`;
                        spinner.text = progressText;
                    },
                });

                spinner.succeed(chalk.green('Download completed'));

                let PrevCap = `${spaces}*[ T I K T O K ]*

${getVideoInfo(video)}
\n${spaces}*[ ${versions.toUpperCase()} ]*`
                await conn.sendFile(m.chat, buffer || giflogo, "", PrevCap, m)
            } catch (e) {
                spinner.fail(chalk.red('Download failed'));
                console.error(e);
            }
        }
        if (versions == "v15") {
            let videoX = await Tiktok(links);

            let XctCap = `${spaces}*[ T I K T O K ]*

${getUserProfileInfo(videoX)}
\n${spaces}*[ ${versions.toUpperCase()} ]*`
            await conn.sendFile(m.chat, videoX.download.nowm || giflogo, "", XctCap, m)
        }

    } catch (e) {
        await m.reply(e.toString());
    }
};

handler.help = ["tiktok"]
handler.tags = ["downloader"]
handler.command = /^t(ik(tok(dl)?|dl)?|t(dl)?)$/i;
export default handler

//@xct007/tiktok-scraper
async function Tiktokdl(url) {
    //async function tiktokdl(url) {
    try {
        function API_URL(aweme) {
            return `https://api16-core-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${aweme}&version_name=1.0.4&version_code=104&build_number=1.0.4&manifest_version_code=104&update_version_code=104&openudid=4dsoq34x808ocz3m&uuid=6320652962800978&_rticket=1671193816600&ts=1671193816&device_brand=POCO&device_type=surya&device_platform=android&resolution=1080*2179&dpi=440&os_version=12&os_api=31&carrier_region=US&sys_region=US%C2%AEion=US&app_name=TikMate%20Downloader&app_language=en&language=en&timezone_name=Western%20Indonesia%20Time&timezone_offset=25200&channel=googleplay&ac=wifi&mcc_mnc=&is_my_cn=0&aid=1180&ssmix=a&as=a1qwert123&cp=cbfhckdckkde1`
        }
        async function getAwemeId(url) {
            // any :/
            let result
            let Konto1 = /video\/([\d|\+]+)?\/?/
            let valid = url.match(Konto1)
            if (valid) {
                return valid[1]
            } else {
                try {
                    let data = await got
                        .get(url, {
                            headers: {
                                "Accept-Encoding": "deflate",
                            },
                            maxRedirects: 0,
                        })
                        .catch((e) => e.response.headers.location)
                    let _url = data
                    let _valid = _url.match(Konto1)
                    if (_valid) {
                        result = _valid[1]
                    }
                } catch (e) {
                    // console.log(e)
                    result = false
                }
            }
            return result
        }
        let valid = await getAwemeId(url)
        //if (!valid) return false // result = false
        let data = await got
            .get(API_URL(valid), {
                headers: {
                    "Accept-Encoding": "deflate",
                    "User-Agent": "okhttp/3.14.9",
                },
            })
            .catch((e) => e.response)
        //if (!data) return false // result = false
        let body = JSON.parse(data.body)
        let obj = body.aweme_list.find((o) => o.aweme_id === valid)
        let results = {
            aweme_id: obj.aweme_id,
            region: obj.region,
            desc: obj.desc,
            create_time: obj.create_time,
            author: {
                uid: obj.author.uid,
                unique_id: obj.author.unique_id,
                nickname: obj.author.nickname,
                birthday: obj.author.birthday,
            },
            duration: obj.music.duration,
            download: {
                nowm: obj.video.play_addr.url_list[0],
                wm: obj.video.download_addr.url_list[0],
                music: obj.music.play_url.url_list[0],
                music_info: {
                    id: obj.music.id,
                    title: obj.music.title,
                    author: obj.music.author,
                    is_original: obj.music.is_original,
                    cover_hd: obj.music.cover_hd.url_list[0],
                    cover_large: obj.music.cover_large.url_list[0],
                    cover_medium: obj.music.cover_medium.url_list[0],
                },
            },
        }
        return {
            status: true,
            result: results //data.body //valid
        }
    } catch (e) {
        return {
            status: false,
            result: e
        }
    }
}

function getVideoInfo(video) {
    return `Video description: ${video.description || ''}\n` +
        `🔗 URL: ${video.url || ''}\n` +
        `👤 Author: ${video.author || ''}\n` +
        `❤️ Likes: ${video.likes || ''}\n` +
        `💬 Comments: ${video.comments || ''}\n` +
        `🔁 Shares: ${video.shares || ''}\n` +
        `▶️ Plays: ${video.playCount || ''}\n` +
        `🎵 Music: ${video.music.name} - ${video.music.author || ''}\n` +
        `🖼️ Thumbnail URL: ${video.previewImageUrl}`;
}

function getEmojiCount(count) {
    let emojis = ['👍', '❤️', '🔁', '💬', '🔥'];
    return emojis[Math.floor(Math.random() * emojis.length)] + count.toLocaleString();
}

function getUserProfileInfo(tiktokData) {
    let user = tiktokData.author;
    let stats = tiktokData.statistics;

    return `User Profile:
🆔 Unique ID: ${user.uid}
👤 Nickname: ${user.nickname}
💬 Description: ${tiktokData.desc}
👥 Comments: ${getEmojiCount(stats.comment_count)}
👍 Likes: ${getEmojiCount(stats.digg_count)}
🎵 Music: ${tiktokData.download.music_info.title}`;
}