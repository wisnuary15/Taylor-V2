import fetch from 'node-fetch';
import {
    lookup
} from 'mime-types';
import {
    extract
} from 'zs-extract';
export async function before(m) {
    let chat = db.data.chats[m.chat] || {};
    if (!chat.lastAnime) chat.lastAnime = [];
    if (chat && chat.updateAnime) {
        setInterval(async () => {
            console.info(`Checking anime update for "${m.chat}"`);
            let {
                title,
                thumbnail: cover,
                detail_url: url
            } = (await getLatestAnime())[0];
            if (chat.lastAnime.includes(title)) return console.info(`${title} already sent to "${m.chat}"`);
            console.info(`Sending anime update ${title} to "${m.chat}"`);
            chat.lastAnime.push(title);
            let detailAnime = await getDetailAnime(url);
            let txt = `Name: ${detailAnime.title}\nEpisode: ${detailAnime.episode}\nSinopsis: ${detailAnime.sinopsis}\nThumbnail: ${detailAnime.cover}`;
            let list = `Download:\n${Object.keys(detailAnime.download)?.map((type, index) => `${index + 1}. (${type}) ${detailAnime.download[type].link}`).join('\n')}`;
            let quoted = await this.sendButtonMessages(m.chat, [
                [`${txt}\n${list}`, detailAnime.update, cover, [], null, [
                    ['Source', url]
                ], null]
            ], fakes);
            if (/Movie/.test(detailAnime.episode)) return this.reply(m.chat, 'Bot cannot send video files because they are too large...', quoted);
            let res = await downloadAnime(detailAnime.download[0]?.link || detailAnime.download[1].link || detailAnime.download[2].link || detailAnime.download[3].link).catch(() => null);
            if (!res) return this.reply(m.chat, 'Download link not available yet...', quoted);
            await this.sendMessage(m.chat, {
                document: {
                    url: res.download
                },
                fileName: res.filename,
                mimetype: res.mimetype
            }, {
                quoted
            });
        }, 80 * 60 * 1000);
    }
}
async function getLatestAnime() {
    let response = await fetch('https://animev1.bimabizz.my.id/api/anime/');
    let data = await response.json();
    return data.data;
}
async function getDetailAnime(url) {
    let response = await fetch(url);
    let {
        data
    } = await response.json();
    let obj = {
        title: data.name,
        episode: url.split('/').pop(),
        update: url.split('/').pop(),
        sinopsis: data.synopsis,
        cover: data.thumbnail,
        download: data.video_direct_links
    };
    return obj;
}
async function downloadAnime(url) {
    let res = await extract(url);
    let mimetype = await lookup(res.download);
    return {
        ...res,
        mimetype
    };
}
