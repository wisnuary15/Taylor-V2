import fetch from 'node-fetch'
import {
    sticker
} from '../../lib/sticker.js'
const handler = async (m, {
    conn
}) => {
    let res = await fetch(API('https://api.waifu.pics', '/sfw/hug'))
    let json = await res.json()
    let stiker = await sticker(null, json.url, packname, author)
    if (stiker) return conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, {
        asSticker: true
    })
    throw stiker.toString()
}
handler.help = ['stickerhug']
handler.tags = ['sticker']
handler.command = /^hug|stickerhug|stikerhug$/i
handler.limit = true
export default handler
