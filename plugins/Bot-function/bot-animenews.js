import fetch from 'node-fetch';
import {
    lookup
} from 'mime-types';
import {
    extract
} from 'zs-extract';
import {
    home,
    detailAnime,
    epsAnime
} from '../../lib/download/otakudesu.js';

export async function before(m) {
    let chat = db.data.chats[m.chat] || {};
    if (!chat.latestNews) chat.latestNews = [];
    if (chat && chat.updateAnimeNews) {
        setInterval(async () => {
            console.info(`Checking anime news for "${m.chat}"`);
            let {
                id
            } = (await home()).home.on_going[0];
            let {
                thumb: cover,
                episode_list
            } = (await detailAnime(id));
            let {
                title,
                id: url
            } = episode_list[0];
            if (chat.latestNews.includes(title)) return console.info(`${title} already sent to "${m.chat}"`);
            console.info(`Sending anime news ${title} to "${m.chat}"`);
            chat.latestNews.push(title);
            let animeDetail = await epsAnime(url);
            let txt = `Name: ${animeDetail.title}`;
            let list = `Download:\n${Object.keys(animeDetail.quality.low_quality.download_links).map((type, index) => `${index + 1}. (${type}) ${animeDetail.quality.low_quality.download_links[type].link}`).join('\n')}`;
            let quoted = await this.sendButtonMessages(m.chat, [[`${txt}\n${list}`, animeDetail.id, cover, [], null, [
                ['Source', url]
            ], null]], fakes);
            if (/Movie/.test(animeDetail.episode)) return this.reply(m.chat, 'Bot cannot send video files because they are too large...', quoted);
            let res = await downloadAnime(animeDetail.link_stream).catch(() => null);
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

async function downloadAnime(url) {
    try {
        let res = await extract(url);
        let mimetype = await lookup(res.download);
        return {
            ...res,
            mimetype
        };
    } catch (error) {
        console.error('Error downloading anime:', error);
        return null;
    }
}