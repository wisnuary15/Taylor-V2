import {
    sticker
} from '../../lib/sticker.js'
import fetch from 'node-fetch'
import fs from "fs"
import {
    Sticker,
    StickerTypes
} from 'wa-sticker-formatter'
import wibusoft from 'wibusoft'
const handler = async (m, {
    conn,
    text,
    args,
    usedPrefix,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom())
    let name = await conn.getName(who)
    let [a, b, c] = text.split(/[xzXZ/i!#\$%\+£¢€¥\^°=¶∆×÷π√✓|©®:;\?&\.\\\-]+/)
    let arrs = ["wsf", "wbs"]
    let emo = "😎"
    let examples = "Input wsf or wbs\n*example:*\n" + usedPrefix + command + " " + emo + usedPrefix + emo + usedPrefix + arrs.getRandom()
    let example = "Input emoji\n*example:*\n" + usedPrefix + command + " " + emo + usedPrefix + emo
    if (a && b) {
        try {
            if (!c) {
                m.reply(wait)
                let anu = await (await fetch("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(a) + "_" + encodeURIComponent(b))).json()
                if (anu.results.length === 0) return m.reply("*Can't mix these 2 emojis!*");
                for (let res of anu.results) {
                    let stiker = await sticker(false, res.url, packname, name)
                    conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
                }
            }
            if (c === "wsf") {
                m.reply(wait + "\n" + "[ WSF ]")
                let anu = await (await fetch("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(a) + "_" + encodeURIComponent(b))).json()
                if (anu.results.length === 0) return m.reply("*Can't mix these 2 emojis!*");
                for (let res of anu.results) {
                    let stiker = await createSticker(false, res.url, packname, name, 60)
                    m.reply(stiker)
                }
            }
            if (c === "wbs") {
                m.reply(wait + "\n" + "[ WIBUSOFT ]")
                let anu = await (await fetch("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(a) + "_" + encodeURIComponent(b))).json()
                if (anu.results.length === 0) return m.reply("*Can't mix these 2 emojis!*");
                for (let res of anu.results) {
                    let stiker = await wibusoft.tools.makeSticker(res.url, {
                        author: packname,
                        pack: name,
                        // circle: true, // default false
                        // keepScale: true, // default false
                    })
                    m.reply(stiker)
                }
            }
        } catch (e) {
            return m.reply(eror)
        }
    } else throw example + "\n\n" + examples
}
handler.help = ['emojimix']?.map(v => v + ' emot1|emot2>')
handler.tags = ['misc']
handler.command = /^(emojimix)$/i
export default handler
async function createSticker(img, url, packName, authorName, quality) {
    let stickerMetadata = {
        type: 'full',
        pack: packName,
        author: authorName,
        quality
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}
