import axios from 'axios';
import cheerio from 'cheerio';
import {
    instagram
} from "@xct007/frieren-scraper";
const {
    instagramdl
} = await (await import("@bochilteam/scraper"));
import {
    Download
} from "../../lib/download/get-download.js";

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    let lister = Array.from({
        length: 6
    }, (_, index) => `v${index + 1}`);
    let [links, versions] = text.split(" ");
    versions = versions ? versions : lister[Math.floor(Math.random() * lister.length)];

    if (!lister.includes(versions.toLowerCase())) return m.reply("*Example:*\n" + usedPrefix + command + " link v2\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v.toUpperCase()).join("\n"));

    try {

        if (!links) return m.reply("Input query link");

        if (versions == "v1") {
            let results = await instagram.v1(links);
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results[0].url;
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }
        if (versions == "v2") {
            let response = await axios.get("https://fantox001-scrappy-api.vercel.app/instadl?url=" + links);
            let results = response.data;
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results.videoUrl;
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }
        if (versions == "v3") {
            let getIgdl = new Download();
            let results = await getIgdl.igdl(links);
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results.media[0];
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }
        if (versions == "v4") {
            let results = await ig(links);
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results.result.medias[0].url;
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }
        if (versions == "v5") {
            let results = await saveig(links);
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results.data[0].url;
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }
        if (versions == "v6") {
            let results = await instagramdl(links);
            let caption = `*[ I N S T A G R A M - ${versions.toUpperCase()} ]*`;
            let out = results.medias[0].url;
            if (out) return conn.sendFile(m.chat, out, "", caption, m);
        }

    } catch (e) {
        await m.reply(e.toString());
    }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^i(nsta(gram(dl)?|dl)|g(dl)?)$/i;

export default handler;

async function ig(url) {
    try {
        const a = await axios.get("https://116.203.129.92/");
        const _a = cheerio.load(a.data);
        const csrf = _a('meta[name="csrf-token"]').attr("content");

        const b = await axios.post(
            "https://116.203.129.92/getData",
            `url=${encodeURIComponent(url)}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    Accept: "*/*",
                    "X-CSRF-TOKEN": csrf,
                    "X-Requested-With": "XMLHttpRequest",
                    cookie: a.headers["set-cookie"]
                }
            }
        );

        return b.data.error ? {
            status: false
        } : {
            status: true,
            result: b.data
        };
    } catch (error) {
        return {
            status: false
        };
    }
}

async function saveig(url) {
    try {
        const response = await axios.post(
            "https://saveig.app/api/ajaxSearch",
            JSON.stringify({
                q: url,
                t: "media",
                lang: "en"
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Origin': 'https://saveig.app/en',
                    'Referer': 'https://saveig.app/en',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'User-Agent': 'PostmanRuntime/7.31.1'
                }
            }
        );

        const json = response.data;
        const $ = cheerio.load(json.data);
        const data = $('div[class="download-items__btn"]').map((i, e) => ({
            type: $(e).find('a').attr('href').match('.jpg') ? 'image' : 'video',
            url: $(e).find('a').attr('href')
        })).get();

        if (!data.length) return {
            status: false
        };

        return {
            status: true,
            data
        };
    } catch (error) {
        console.log(error);
        return {
            status: false,
            msg: error.message
        };
    }
}