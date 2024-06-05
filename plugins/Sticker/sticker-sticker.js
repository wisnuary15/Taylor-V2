import fetch from "node-fetch"
import {
    Sticker
} from 'wa-sticker-formatter'
import {
    sticker,
    addExif,
    video2webp,
    video2webp30,
    video2webp45,
    video2webp60
} from '../../lib/sticker.js'
import {
    emojiGraph,
    searchEmoji,
    emojiPedia
} from '../../lib/scraper/scraper-search.js'
import emojiRegex from "emoji-regex"
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let stiker = false
    try {
        let [packnames, ...authors] = args.join(" ").split("|")
        authors = (authors || []).join("|")
        let q = m.quoted ? m.quoted : m
        let mime = q.mtype || ""
        m.reply(wait)
        if (/stickerMessage/g.test(mime)) {
            let img = await q?.download()?.()
            try {
                stiker = await addExif(await sticker(img, false, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await _createSticker(img, false, packnames || packname, authors || m.name, 30)
                } catch (e) {
                    throw "Failed"
                }
            }
        } else if (/imageMessage/g.test(mime)) {
            let img = await q?.download()?.()
            try {
                stiker = await addExif(await sticker(img, false, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await _createSticker(img, false, packnames || packname, authors || m.name, 30)
                } catch (e) {
                    throw "Failed"
                }
            }
        } else if (/videoMessage/g.test(mime)) {
            if ((q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
            let img = await q?.download()?.()
            try {
                stiker = await addExif(await sticker(img, false, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await video2webp(img) || await video2webp30(img) || await video2webp45(img) || await video2webp60(img)
                } catch (e) {
                    try {
                        stiker = await _createSticker(img, false, packnames || packname, authors || m.name, 30)
                    } catch (e) {
                        throw "Failed"
                    }
                }
            }
        } else if (/documentMessage/g.test(mime)) {
            let img = await q?.download()?.()
            try {
                stiker = await addExif(await sticker(img, false, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await _createSticker(img, false, packnames || packname, authors || m.name, 30)
                } catch (e) {
                    throw "Failed"
                }
            }
        } else if (/viewOnceMessageV2/g.test(mime)) {
            let img = await q?.download()?.()
            try {
                stiker = await addExif(await sticker(img, false, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await _createSticker(img, false, packnames || packname, authors || m.name, 30)
                } catch (e) {
                    throw "Failed"
                }
            }
        } else if (args[0] && isUrl(args[0])) {
            try {
                stiker = await addExif(await sticker(false, args[0], packnames || packname, authors || m.name), packnames || packname, authors || m.name)
            } catch (e) {
                try {
                    stiker = await _createSticker(false, args[0], packnames || packname, authors || m.name, 30)
                } catch (e) {
                    throw "Failed"
                }
            }
        } else if (/extendedTextMessage/g.test(mime)) {
            let emj;
            let emojiData;
            let foundLinks;
            const text = q.text;
            const urlRegex = /https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|bmp|webp|mp4|mkv|avi|mov|wmv|flv)(\?[^\s]*)?/gi;
            const firstEmoji = (text.match(emojiRegex()) || [])[0];
            if (firstEmoji) {
                try {
                    emojiData = await emojiPedia(firstEmoji);
                    emj = getUrlByName(emojiData, args[0] || "WhatsApp");
                } catch (e) {
                    try {
                        emojiData = (await emojiGraph(await searchEmoji(firstEmoji)[0]))[0]?.vendors;
                        emj = getUrlByName(emojiData, args[0] || "Whatsapp");
                    } catch (e) {
                        throw "Failed";
                    }
                }
                try {
                    stiker = await addExif(await sticker(false, emj, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
                } catch (e) {
                    try {
                        stiker = await _createSticker(false, emj, packnames || packname, authors || m.name, 30)
                    } catch (e) {
                        throw "Failed";
                    }
                }
            } else {
                foundLinks = text.match(urlRegex);
                if (foundLinks && foundLinks.length > 0) {
                    for (let i = 0; i < foundLinks.length; i++) {
                        emj = foundLinks[i];
                        if (emj) {
                            try {
                                stiker = await addExif(await sticker(false, emj, packnames || packname, authors || m.name), packnames || packname, authors || m.name)
                            } catch (e) {
                                try {
                                    stiker = await _createSticker(false, emj, packnames || packname, authors || m.name, 30)
                                } catch (e) {
                                    throw "Failed";
                                }
                            }
                        }
                    }
                } else {
                    return m.reply(`No emojis or links found in the input text!\nOr\nReply with an image/video/sticker with command ${usedPrefix + command}`);
                }
            }
        } else return m.reply(`No emojis found in the input text!\nOr\nReply an image/video/sticker with command ${usedPrefix + command}`)
    } catch (e) {
        console.log(e)
        stiker = e
    } finally {
        if (stiker) return m.reply(stiker)
    }
}
handler.help = ["stiker (caption|reply media)", "stiker <url>", "stikergif (caption|reply media)", "stikergif <url>"]
handler.tags = ["sticker"]
handler.command = /^s(ti(c?k(er(gif)?)?|c)|gif)?$/i
export default handler

function getUrlByName(data, query) {
    const matchedObject = data.find(item => item.name === query);
    return matchedObject ? matchedObject.image : data.length > 0 ? data[Math.floor(Math.random() * data.length)].image : null;
}
const isUrl = (text) => text.match(/https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|bmp|webp|mp4|mkv|avi|mov|wmv|flv)(\?[^\s]*)?/gi)
async function _createSticker(img, url, packName, authorName, quality = 30) {
    try {
        let stickerMetadata = {
            type: 'full',
            pack: packName,
            author: authorName,
            quality
        }
        return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
    } catch (error) {
        console.error('Error:', error);
    }
}
async function mp4ToWebp(file, stickerMetadata) {
    try {
        if (stickerMetadata) {
            if (!stickerMetadata.pack) stickerMetadata.pack = '‎'
            if (!stickerMetadata.author) stickerMetadata.author = '‎'
            if (!stickerMetadata.crop) stickerMetadata.crop = false
        } else if (!stickerMetadata) {
            stickerMetadata = {
                pack: '‎',
                author: '‎',
                crop: false
            }
        }
        let getBase64 = file.toString('base64')
        const Format = {
            file: `data:video/mp4;base64,${getBase64}`,
            processOptions: {
                crop: stickerMetadata?.crop,
                startTime: '00:00:00.0',
                endTime: '00:00:7.0',
                loop: 0
            },
            stickerMetadata: {
                ...stickerMetadata
            },
            sessionInfo: {
                WA_VERSION: '2.2106.5',
                PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
                WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
                BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
                OS: 'Windows Server 2016',
                START_TS: 1614310326309,
                NUM: '6247',
                LAUNCH_TIME_MS: 7934,
                PHONE_VERSION: '2.20.205.16'
            },
            config: {
                sessionId: 'session',
                headless: true,
                qrTimeout: 20,
                authTimeout: 0,
                cacheEnabled: false,
                useChrome: true,
                killProcessOnBrowserClose: true,
                throwErrorOnTosBlock: false,
                chromiumArgs: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--aggressive-cache-discard',
                    '--disable-cache',
                    '--disable-application-cache',
                    '--disable-offline-load-stale-cache',
                    '--disk-cache-size=0'
                ],
                executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
                skipBrokenMethodsCheck: true,
                stickerServerEndpoint: true
            }
        }
        let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
            method: 'post',
            headers: {
                Accept: 'application/json, text/plain, /',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(Format)
        })
        return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
    } catch (error) {
        console.error('Error:', error);
    }
}
