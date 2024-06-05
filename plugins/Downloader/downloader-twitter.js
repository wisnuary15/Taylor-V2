import fetch from 'node-fetch';
import hx from 'hxz-api';
const handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    if (!args[0]) {
        return m.reply('Masukkan Link Twitter yang ingin diunduh.');
    }
    try {
        let list = '*⚡ Twitter Search Result ⚡*\n\n';
        list += `1. *Metode A*\n   ${usedPrefix}${command} ${args[0]} v1\n\n`;
        list += `2. *Metode B*\n   ${usedPrefix}${command} ${args[0]} v2\n\n`;
        list += 'Ketik angka metode untuk memilih Twitter Search.\nContoh: ' + usedPrefix + command + ' ' + args[0] + ' v1';
        if (args[1] === 'v1') {
            let res = await twitterDl(args[0]);
            for (let x = 0; x < res.media.length; x++) {
                let caption = x === 0 ? res.caption.replace(/https:\/\/t.co\/[a-zA-Z0-9]+/gi, '').trim() : '';
                conn.sendFile(m.chat, res.media[x].url, '', caption, m);
            }
        } else if (args[1] === 'v2') {
            /* Twit */
            await hx.fbdown(`${args[0]}`)
                .then(G => {
                    let ten = `${G.HD}`;
                    conn.sendFile(m.chat, ten, '', `*desc*: ${G.desc}\n━━━━━•───────────────\n       ⇆  ❚❚ ▷  ↻`, m);
                });
        } else {
            m.reply(list);
        }
    } catch (e) {
        m.reply('Error. Periksa kembali link atau metode yang Anda masukkan.');
    }
};
handler.help = ['twitter']?.map(v => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /^twit(t(er(dl)?)?)?$/i;
export default handler;
async function twitterDl(url) {
    const idMatch = /twitter\.com\/[^/]+\/status\/(\d+)/.exec(url);
    const id = idMatch ? idMatch[1] : null;
    if (!id) throw 'Invalid URL';
    const res = await fetch(`https://tweetpik.com/api/tweets/${id}`);
    if (res.status !== 200) throw res.statusText;
    const json = await res.json();
    if (json.media) {
        const media = await Promise.all(
            json.media?.map(async (i) => {
                if (/video|animated_gif/.test(i.type)) {
                    const vids = await (await fetch(`https://tweetpik.com/api/tweets/${id}/video`)).json();
                    const vid = vids.variants.pop();
                    return {
                        url: vid.url,
                        type: i.type,
                    };
                } else {
                    return {
                        url: i.url,
                        type: i.type,
                    };
                }
            })
        );
        return {
            caption: json.text,
            media,
        };
    } else {
        throw 'No media found';
    }
}
