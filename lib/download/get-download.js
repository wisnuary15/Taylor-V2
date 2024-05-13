import axios from "axios";
import cheerio from "cheerio";
import fetch from "node-fetch";
import {
    sizeFormatter
} from "human-readable";

const formatp = sizeFormatter({
    std: "JEDEC",
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
});

async function getType(url) {
    return new Promise(async (resolve, reject) => {
        axios.get(url).then((a) => {
            if (a.data.includes("-i-photomode-")) {
                resolve("image");
            } else {
                resolve("video");
            }
        });
    });
}

function findBetween(str, start, end) {
    const startIndex = str.indexOf(start) + start.length;
    const endIndex = str.indexOf(end, startIndex);
    return str.substring(startIndex, endIndex);
}

class Download {
    tiktok = (url) => {
        return new Promise(async (resolve, reject) => {
            let type = await getType(url);
            let get = await axios({
                url: "https://ttsave.app/download",
                method: "POST",
                params: {
                    mode: type == "image" ? "slide" : "video",
                    key: "0e23d2bf-e520-4ac7-9cf3-27f60a4a8cee",
                },
                data: {
                    id: url
                },
            });
            const $ = cheerio.load(get.data);
            const res = {
                type: type,
                name: $("h2").text(),
                username: $("a.font-extrabold.text-blue-400.text-xl").text().trim(),
                profile: $(".flex.flex-col.justify-center.items-center > img").attr(
                    "src",
                ),
                views: $(
                        ".flex.flex-row.items-center.justify-center div:nth-child(1) span",
                    )
                    .text()
                    .trim(),
                likes: $(
                        ".flex.flex-row.items-center.justify-center div:nth-child(2) span",
                    )
                    .text()
                    .trim(),
                comments: $(
                        ".flex.flex-row.items-center.justify-center div:nth-child(3) span",
                    )
                    .text()
                    .trim(),
                favorite: $(
                        ".flex.flex-row.items-center.justify-center div:nth-child(4) span",
                    )
                    .text()
                    .trim(),
                shares: $(
                        ".flex.flex-row.items-center.justify-center div:nth-child(5) span",
                    )
                    .text()
                    .trim(),
                sound: $(
                        "div#button-download-ready .flex.flex-row.items-center.justify-center.mt-5.w-3/4 span",
                    )
                    .text()
                    .trim(),
                description: $("p").text().trim(),
            };

            if (res.type === "video") {
                const videoUrl = {};
                $("div#button-download-ready a").each((index, element) => {
                    const link = $(element).attr("href");
                    const type = $(element).attr("type");
                    videoUrl[type] = link;
                });
                res.video = videoUrl;
            }

            if (res.type === "image") {
                const imageUrl = [];
                $('div#button-download-ready a[type="slide"]').each(
                    (index, element) => {
                        imageUrl.push($(element).attr("href"));
                    },
                );
                res.image = imageUrl;
            }
            resolve(res);
        });
    };
    instagram = (url) => {
        return new Promise(async (resolve, reject) => {
            let urls;
            if (/(https:\/\/)?instagram\.com\/p\/[^\/?#&]+/.test(url))
                urls = "download-photo-instagram";
            if (
                /(https:\/\/)?instagram\.com\/stories\/highlight\/[^\/?#&]+/.test(url)
            )
                urls = "download-highlights-instagram";
            if (/(https:\/\/)?instagram\.com\/reel\/[^\/?#&]+/.test(url))
                urls = "download-reel-instagram";
            if (/(https:\/\/)?instagram\.com\/stories\/[^\/?#&]+/.test(url))
                urls = "download-story-instagram";
            const payload = new URLSearchParams(
                Object.entries({
                    via: "form",
                    ref: urls,
                    url: url,
                }),
            );
            await axios
                .post("https://reelsaver.net/api/instagram", payload, {
                    headers: {
                        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                })
                .then((response) => {
                    const res = response.data;
                    resolve(res.data);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };
    igdl = async (url) => {
        return new Promise(async (resolve, reject) => {
            const payload = new URLSearchParams(
                Object.entries({
                    url: url,
                    host: "instagram",
                }),
            );
            await axios
                .request({
                    method: "POST",
                    baseURL: "https://saveinsta.io/core/ajax.php",
                    data: payload,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
                        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                    },
                })
                .then((response) => {
                    const $ = cheerio.load(response.data);
                    const mediaURL = $(
                            "div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom",
                        )
                        .map((_, el) => {
                            return (
                                "https://saveinsta.io/" +
                                $(el).find("div.col-md-8.mx-auto > a").attr("href")
                            );
                        })
                        .get();
                    const res = {
                        status: 200,
                        media: mediaURL,
                    };
                    resolve(res);
                })
                .catch((e) => {
                    console.log(e);
                    throw {
                        status: 400,
                        message: "error",
                    };
                });
        });
    };
    facebook = (url) => {
        return new Promise(async (resolve, reject) => {
            if (/(https:\/\/)?instagram\.com/.test(url)) throw "Invalid url!!";
            await axios
                .post(
                    this.facebookURL + "/process", {
                        id: url,
                        locale: "id",
                    }, {
                        headers: {
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                        },
                    },
                )
                .then((response) => {
                    const $ = cheerio.load(response.data);
                    const result = {};
                    const hdLink = $(".hd-button").attr("href");
                    const sdLink = $(".sd-button").attr("href");

                    result["hd"] = {
                        quality: "720p(HD)",
                        url: hdLink,
                    };

                    result["sd"] = {
                        quality: "360p(SD)",
                        url: sdLink,
                    };
                    resolve(result);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };
    pinterest = async (query) => {
        if (query.match(URL_REGEX)) {
            let res = await fetch(
                `https://savepin.io/frontendService/DownloaderService?url=${query}`,
            );
            let item = await res.json();
            const mp4Media = item.medias.find((media) => media.extension === "mp4");
            if (mp4Media) {
                return mp4Media.url;
            } else {
                const jpgMedia = item.medias.find((media) => media.extension === "jpg");
                return jpgMedia.url;
            }
        } else {
            let res = await fetch(
                `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${query}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${query}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`,
            );
            let json = await res.json();
            let data = json.resource_response.data.results;
            if (!data.length) throw `Query "${query}" not found :/`;
            return data[~~(Math.random() * data.length)].images.orig.url;
        }
    };
    snackVideo = (url) => {
        return new Promise(async (resolve, reject) => {
            await axios
                .post("https://api.teknogram.id/v1/snackvideo", {
                    url: url,
                })
                .then(({
                    data
                }) => {
                    resolve(data);
                })
                .catch((e) => {
                    reject(e.data);
                });
        });
    };
    LikeDown = (url) => {
        return new Promise(async (resolve, reject) => {
            const {
                data
            } = await axios.request(
                "https://likeedownloader.com/process", {
                    method: "post",
                    data: new URLSearchParams(Object.entries({
                        id: url,
                        locale: "en"
                    })),
                    headers: {
                        cookie: "_ga=GA1.2.553951407.1656223884; _gid=GA1.2.1157362698.1656223884; __gads=ID=0fc4d44a6b01b1bc-22880a0efed2008c:T=1656223884:RT=1656223884:S=ALNI_MYp2ZXD2vQmWnXc2WprkU_p6ynfug; __gpi=UID=0000069517bf965e:T=1656223884:RT=1656223884:S=ALNI_Map47wQbMbbf7TaZLm3TvZ1eI3hZw; PHPSESSID=e3oenugljjabut9egf1gsji7re; _gat_UA-3524196-10=1",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    },
                },
            );
            const $ = cheerio.load(data.template);
            result = {
                status: 200,
                title: $("p.infotext").eq(0).text().trim(),
                thumbnail: $(".img_thumb img").attr("src"),
                watermark: $(".with_watermark").attr("href"),
                no_watermark: $(".without_watermark").attr("href"),
            };
            resolve(result);
        });
    };
    douyin = (url) => {
        return new Promise(async (resolve, reject) => {
            const {
                data
            } = await axios("https://www.tikdd.cc/g1.php", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
                },
                data: "url=" + url + "&count=12&cursor=0&web=1&hd=1",
                method: "POST",
            });
            resolve(data);
        });
    };
    krakenfiles = (url) => {
        return new Promise(async (resolve, reject) => {
            const {
                data
            } = await axios.get(url);
            const $ = cheerio.load(data);
            const fileHash = $("div.col-xl-4.col-lg-5.general-information").attr(
                "data-file-hash",
            );
            const tokens = $("input[name='token']").val();
            const result = {};
            const payload = new URLSearchParams(
                Object.entries({
                    token: tokens,
                }),
            );
            const {
                data: res
            } = await axios.post(
                "https://s5.krakenfiles.com/download/" + fileHash,
                payload,
            );
            result.title = $("div.coin-info > .coin-name > h5").text().trim();
            $("div.nk-iv-wg4-sub > .nk-iv-wg4-overview.g-2 > li").each(function() {
                const param = $(this)
                    .find("div.sub-text")
                    .text()
                    .replace(/ /g, "")
                    .toLowerCase();
                const value = $(this).find("div.lead-text").text().trim();
                result[param] = value;
            });
            result.views = $("div.views-count").text().trim();
            result.downloads = $("div.lead-text.downloads-count > strong")
                .text()
                .trim();
            result.fileHash = fileHash;
            result.url = res.url;
            resolve(result);
        });
    };
    cocofun = (url) => {
        return new Promise((resolve, reject) => {
            axios({
                    url,
                    method: "get",
                    headers: {
                        Cookie: "client_id=1a5afdcd-5574-4cfd-b43b-b30ad14c230e",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
                    },
                })
                .then((data) => {
                    $ = cheerio.load(data.data);
                    let json;
                    const res = $("script#appState").get();
                    for (let i of res) {
                        if (i.children && i.children[0] && i.children[0].data) {
                            ress = i.children[0].data.split("window.APP_INITIAL_STATE=")[1];
                            json = JSON.parse(ress);
                        }
                        const result = {
                            status: 200,
                            topic: json.share.post.post.content ?
                                json.share.post.post.content : json.share.post.post.topic.topic,
                            caption: $("meta[property='og:description']").attr("content"),
                            play: json.share.post.post.playCount,
                            like: json.share.post.post.likes,
                            share: json.share.post.post.share,
                            duration: json.share.post.post.videos[json.share.post.post.imgs[0].id]
                                .dur,
                            thumbnail: json.share.post.post.videos[json.share.post.post.imgs[0].id]
                                .coverUrls[0],
                            watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id]
                                .urlwm,
                            no_watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id]
                                .url,
                        };
                        resolve(result);
                    }
                })
                .catch(reject);
        });
    };
    capcut = (url) => {
        return new Promise(async (resolve, reject) => {
            axios
                .get("https://ssscap.net/api/download/get-url?url=" + url, {
                    headers: {
                        cookie: "sign=94b3b2331a3515b3a031f161e6ce27a7; device-time=1693144685653",
                    },
                })
                .then((res) => {
                    let tes = res.data.url;
                    const parsedUrl = new URL(tes);
                    let id = parsedUrl.searchParams.get("template_id");

                    axios("https://ssscap.net/api/download/" + id, {
                        headers: {
                            cookie: "sign=4b0366645cd40cbe10af9aa18331a488; device-time=1693145535913",
                        },
                    }).then((dwn) => {
                        resolve(dwn.data);
                    });
                });
        });
    };
    GDriveDl = async (url) => {
        let id;
        if (!(url && url.match(/drive\.google/i))) throw "Invalid URL";
        id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1];
        if (!id) throw "ID Not Found";
        let res = await fetch(
            `https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
                method: "post",
                headers: {
                    "accept-encoding": "gzip, deflate, br",
                    "content-length": 0,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    origin: "https://drive.google.com",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                    "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                    "x-drive-first-party": "DriveWebUi",
                    "x-json-requested": "true",
                },
            },
        );
        let {
            fileName,
            sizeBytes,
            downloadUrl
        } = JSON.parse(
            (await res.text()).slice(4),
        );
        if (!downloadUrl) throw "Link Download Limit!";
        let data = await fetch(downloadUrl);
        if (data.status !== 200) throw data.statusText;
        return {
            downloadUrl,
            fileName,
            fileSize: formatp(sizeBytes),
            mimetype: data.headers.get("content-type"),
        };
    };
    sfiledown = (url) => {
        return new Promise(async (resolve, reject) => {
            const html = await axios.get(url).then(({
                data
            }) => {
                const $ = cheerio.load(data);
                const urls = $("#download").attr("onclick");
                const results = {
                    title: $("div.intro-container.w3-blue-grey h1").text().trim(),
                    mimetype: $("div.list").eq(0).text().split("-")[1],
                    url: $("#download").attr("href") +
                        `&k=${urls.match(/(?<=\')[^\']+?(?=\')/g).pop()}`,
                };
                resolve(results);
            });
        });
    };
    xbuddy = (url) => {
        return new Promise(async (resolve, reject) => {
            let headers = {
                authority: "ab.9xbud.com",
                accept: "application/json, text/plain, */*",
                "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json; charset=UTF-8",
                origin: "https://9xbuddy.com",
                referer: "https://9xbuddy.com/",
                "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "Android",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "x-access-token": "false",
                "x-auth-token": "m6iW2sqX3V+W1c9gZpielptllZ7EYGaYnpabZZWexGJ/nYSWhIiwrs2Dg7e4jMN+dLqnqKqVrcebrY+ummlim5Rj",
                "x-requested-domain": "9xbuddy.com",
                "x-requested-with": "xmlhttprequest",
            };
            const {
                data
            } = await axios.post(
                "https://ab.9xbud.com/token", {}, {
                    headers,
                },
            );
            headers["X-Access-Token"] = data?.access_token;
            const response = await axios.post(
                "https://ab1.9xbud.com/extract", {
                    url: encodeURIComponent(url),
                    searchEngine: "yt",
                }, {
                    headers,
                },
            );
            resolve(response.data);
            console.log(response.data);
        });
    };
    terabox = (urls) => {
        return new Promise(async (resolve, reject) => {
            const req = await axios.get(urls, {
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
                    Connection: "keep-alive",
                    Cookie: "csrfToken=x0h2WkCSJZZ_ncegDtpABKzt; browserid=Bx3OwxDFKx7eOi8np2AQo2HhlYs5Ww9S8GDf6Bg0q8MTw7cl_3hv7LEcgzk=; lang=en; TSID=pdZVCjBvomsN0LnvT407VJiaJZlfHlVy; __bid_n=187fc5b9ec480cfe574207; ndus=Y-ZNVKxteHuixZLS-xPAQRmqh5zukWbTHVjen34w; __stripe_mid=895ddb1a-fe7d-43fa-a124-406268fe0d0c36e2ae; ndut_fmt=FF870BBFA15F9038B3A39F5DDDF1188864768A8E63DC6AEC54785FCD371BB182",
                    DNT: "1",
                    Host: "www.4funbox.com",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-User": "?1",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
                    "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                },
                withCredentials: true
            });
            const responseData = req.data;

            const jsToken = findBetween(responseData, "fn%28%22", "%22%29");
            const logid = findBetween(responseData, "dp-logid=", "&");
            if (!jsToken || !logid) {
                return resolve({
                    error: "Invalid jsToken, logid"
                });
            }

            const {
                searchParams: requestUrl,
                href
            } = new URL(urls);
            if (!requestUrl.has("surl")) {
                return resolve({
                    error: "Missing data"
                });
            }
            const surl = requestUrl.get("surl");

            const params = {
                app_id: "250528",
                web: "1",
                channel: "dubox",
                clienttype: "0",
                jsToken: jsToken,
                dplogid: logid,
                page: "1",
                num: "20",
                order: "time",
                desc: "1",
                site_referer: href,
                shorturl: surl,
                root: "1",
            };

            const response = await axios.get("https://www.4funbox.com/share/list", {
                params,
                headers: {
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
                    Connection: "keep-alive",
                    Cookie: "csrfToken=x0h2WkCSJZZ_ncegDtpABKzt; browserid=Bx3OwxDFKx7eOi8np2AQo2HhlYs5Ww9S8GDf6Bg0q8MTw7cl_3hv7LEcgzk=; lang=en; TSID=pdZVCjBvomsN0LnvT407VJiaJZlfHlVy; __bid_n=187fc5b9ec480cfe574207; ndus=Y-ZNVKxteHuixZLS-xPAQRmqh5zukWbTHVjen34w; __stripe_mid=895ddb1a-fe7d-43fa-a124-406268fe0d0c36e2ae; ndut_fmt=FF870BBFA15F9038B3A39F5DDDF1188864768A8E63DC6AEC54785FCD371BB182",
                    DNT: "1",
                    Host: "www.4funbox.com",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Sec-Fetch-User": "?1",
                    "Upgrade-Insecure-Requests": "1",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
                    "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                },
                withCredentials: true,
            });
            const responseData2 = response.data;
            if ((!"list") in responseData2) {
                resolve({
                    error: "Invalid response"
                });
            }
            resolve(responseData2?.list[0]);
        });
    };

    jooxdl = (url) => {
        return new Promise(async (resolve, reject) => {
            await axios
                .get(
                    "http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=" +
                    url +
                    "&lang=id&country=id&from_type=null&channel_id=null&_=" +
                    new Date().getTime(), {
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: "wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;",
                            useragent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36",
                        },
                    },
                )
                .then((res) => {
                    const mentahan = res.data;
                    const replaced = mentahan.replace("MusicInfoCallback(", "").replace(
                        `}
)`,
                        "}",
                    );
                    const jsone = JSON.parse(replaced);
                    const title = jsone.msong;
                    const artist = jsone.msinger;
                    const album = jsone.malbum;
                    const img = jsone.imgSrc;
                    const mp3_url = jsone.mp3Url;
                    const filesize = jsone.size128;
                    const ext = "mp3";
                    const interval = jsone.minterval;
                    const result = {
                        judul: title,
                        artist: artist,
                        album: album,
                        img_url: img,
                        mp3_url: mp3_url,
                        ext: ext,
                    };
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };
}

function get(url, token) {
    return new Promise(async (resolve, reject) => {
        if (url.startsWith("https://vm.tiktok.com/") || url.startsWith("https://www.tiktok.com/") || url.startsWith("https://m.tiktok.com/v/")) {
            axios.get('https://tikwm.com/api/?url=' + url)
                .then((resp) => {
                    const result = {
                        tiktok: resp.data.data.play
                    }
                    resolve(result);
                })
        } else if (url.startsWith("https://www.facebook.com/")) {
            try {
                const vid = url.match(/\/(?:videos|reel|watch|story\.php).*?(?:\/|\?v=|story_fbid=)(\d+)/)?.[1];
                const response = await fetch(`https://graph.facebook.com/v8.0/${vid}?fields=source&access_token=${token}`);
                const data = await response.json();
                if (data.source === undefined) {
                    try {
                        const response = await fetch('https://www.facebook.com/api/graphql/', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams({
                                doc_id: '5279476072161634',
                                variables: JSON.stringify({
                                    UFI2CommentsProvider_commentsKey: 'CometTahoeSidePaneQuery',
                                    caller: 'CHANNEL_VIEW_FROM_PAGE_TIMELINE',
                                    displayCommentsContextEnableComment: null,
                                    displayCommentsContextIsAdPreview: null,
                                    displayCommentsContextIsAggregatedShare: null,
                                    displayCommentsContextIsStorySet: null,
                                    displayCommentsFeedbackContext: null,
                                    feedbackSource: 41,
                                    feedLocation: 'TAHOE',
                                    focusCommentID: null,
                                    privacySelectorRenderLocation: 'COMET_STREAM',
                                    renderLocation: 'video_channel',
                                    scale: 1,
                                    streamChainingSection: false,
                                    useDefaultActor: false,
                                    videoChainingContext: null,
                                    videoID: vid,
                                }),
                                fb_dtsg: "",
                                server_timestamps: true,
                            }),
                        });
                        const data = await response.text();
                        const parsedData = JSON.parse(data.split('\n')[0]);
                        if (parsedData.data.video == null && url.indexOf('/permalink/') !== -1) {
                            fetch("https://fdownload.app/api/ajaxSearch", {
                                    "headers": {
                                        "accept": "*/*",
                                        "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
                                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        "x-requested-with": "XMLHttpRequest",
                                        "Referer": "https://fdownload.app/en"
                                    },
                                    "body": `p=home&q=${encodeURIComponent(url)}`,
                                    "method": "POST"
                                })
                                .then(response => response.json())
                                .then(data => {
                                    var $1 = cheerio.load(data.data);
                                    var link = $1('.button.is-success.is-small.download-link-fb').attr('href');
                                    var time = $1('p').text();
                                    time = time.split(":");
                                    if (time[0] >= 5) {
                                        var e = 819
                                        reject(e)
                                    } else {
                                        const result = {
                                            facebook: link
                                        }
                                        resolve(result);
                                    }
                                }).catch(e => {
                                    reject({
                                        status: false,
                                        message: 'error fetch data',
                                        e: e.message
                                    })
                                });
                        } else {
                            const videoUrl =
                                parsedData.data.video.playable_url_quality_hd ||
                                parsedData.data.video.playable_url;
                            const result = {
                                facebook: videoUrl
                            }
                            resolve(result);
                        }
                    } catch (error) {
                        reject({
                            status: false,
                            message: 'error fetch data',
                            e: error.message
                        })
                    }
                } else {
                    const result = {
                        facebook: data.source
                    }
                    resolve(result);
                }
            } catch (error) {
                reject({
                    status: false,
                    message: 'error fetch data',
                    e: error.message
                })
            }
        } else if (url.startsWith("https://l.facebook.com/") || url.startsWith("https://fb.watch/")) {
            if (url.startsWith("https://l.facebook.com/")) {
                const uValue = url.match(/u=([^&]+)/)[1];
                const decodedValue = decodeURIComponent(uValue);
                resolve(get(decodedValue, token));
            } else {
                axios.get(url, {
                        maxRedirects: 1
                    })
                    .then(response => {
                        const regex = /<([^>]+)>/;
                        const matches = regex.exec(response.headers.link);
                        const url = matches[1];
                        resolve(get(url, token));
                    })
                    .catch(error => {
                        console.error('An error occurred:', error);
                    });
            }
        } else if (url.startsWith("https://www.instagram.com/p/") || url.startsWith("https://www.instagram.com/tv/") || url.startsWith("https://www.instagram.com/reel/") || url.startsWith("https://www.instagram.com/reels/")) {
            axios.post("https://insta.savetube.me/downloadPostVideo", {
                    url: url
                }, {
                    headers: {
                        "Referer": "https://insta.savetube.me/reels-download",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    }
                })
                .then(response => {
                    const result = {
                        instavid: response.data.post_video_url
                    }
                    resolve(result)
                })
                .catch(error => {
                    if (error.response.status == 500) {
                        reject(1315);
                    } else {
                        reject({
                            status: false,
                            message: 'error fetch data'
                        })
                    }
                });
        } else if (url.startsWith("https://www.instagram.com/stories/") || url.startsWith("https://instagram.com/stories/")) {
            fetch("https://ssyoutube.com/api/ig/story?url=" + encodeURIComponent(url), {
                    "headers": {
                        "accept": "application/json, text/plain, */*",
                        "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest",
                        "cookie": "_ga=GA1.2.1105512461.1669141912; uid=7dd280a92bfd4314; push=29; outputStats=37; clickAds=38; _gid=GA1.2.640126404.1676296979; laravel_session=eyJpdiI6IjRHMU1xamtYR3R6Q0k1azJOQ1psRVE9PSIsInZhbHVlIjoiMjNkRkpxS3lxaEFwWmlRL0pIbC8vMWRIczBuM2tWb1ZRb0twcmlzLzQzMW5Yek5RVmpGZFZyMGFuMWhoWWtaVWc2MFFEdVpOT1NCOVNMa1pEeUp6S3VjN093a2IwMFROY1V3cUw1YWRyS0YrKzN0YjVINjJrNjFWV2o3YmcvWjQiLCJtYWMiOiJkZmY5MDJjNGNjN2JhNTZlNmRiM2IzODg4ZGFlM2RjMWY4ZTYyMjI0YjZiYjUwODA0OTdhN2NhZmVjNWEwOThlIiwidGFnIjoiIn0%3D; _gat_outputStats=1",
                        "Referer": "https://ssyoutube.com/en467/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": null,
                    "method": "GET"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result[0].video_versions) {
                        const result = {
                            instavid: data.result[0].video_versions[0].url
                        }
                        resolve(result);
                    } else {
                        const result = {
                            instimage: data.result[0].image_versions2.candidates[0].url
                        }
                        resolve(result);
                    }
                }).catch(e => {
                    reject({
                        status: false,
                        message: 'error fetch data',
                        e: e.message
                    })
                });
        } else if (url.startsWith("@")) {
            let uid = url.split("@");
            fetch("https://igdownloader.com/ajax", {
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                        "Referer": "https://igdownloader.com/reels-downloader"
                    },
                    "body": `link=https://www.instagram.com/${uid[1]}&downloader=avatar`,
                    "method": "POST"
                })
                .then(response => response.json())
                .then(data => {
                    var $1 = cheerio.load(data.html);
                    var link = $1('.download-button').attr('href');
                    const result = {
                        instavatar: link
                    }
                    resolve(result);
                }).catch(e => {
                    reject({
                        status: false,
                        message: 'error fetch data',
                        e: e.message
                    })
                });
        } else if (url.startsWith("https://youtube.com/") || url.startsWith("https://www.youtube.com/") || url.startsWith("https://youtu.be/")) {
            const vid = url.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/)?(?:watch\?v=)?|youtu\.be\/)([^?/]+)/)[1]
            axios.post("https://api.ytbvideoly.com/api/thirdvideo/parse",
                    `link=${encodeURIComponent(url)}&from=videodownloaded`, {
                        headers: {
                            "accept": "*/*",
                            "accept-language": "en,ar-DZ;q=0.9,ar;q=0.8",
                            "content-type": "application/x-www-form-urlencoded",
                            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site"
                        },
                        referrerPolicy: "no-referrer"
                    })
                .then(response => {
                    const formattedTime = `${Math.floor(response.data.data.duration / 60)}:${(response.data.data.duration % 60 < 10 ? "0" : "") + (response.data.data.duration % 60)}`;
                    const result = {
                        shorts: [{
                            cover: `https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`,
                            id: vid,
                            name: response.data.data.title,
                            duration: formattedTime,
                            vid: response.data.data.videos.mp4[0].url,
                            audio: response.data.data.audios.m4a[0].url
                        }]
                    }
                    resolve(result);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    })
}
export {
    get,
    Download
};