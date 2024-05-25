import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import fetch from 'node-fetch'

const handler = async (m, { args, usedPrefix, command }) => {
    try {
        const q = m.quoted || m
        const mime = (q.msg || q).mimetype || ''
        if (!mime) throw 'No media found'

        const media = await q.download()
        const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
        const link = await (isTele ? uploadImage : uploadFile)(media)

        const caption = `📮 *Link:*\n${link}\n\n📊 *Size:* ${formatBytes(media.length)}\n📛 *Expired:* ${isTele ? 'No Expiry Date' : 'Unknown'}\n\n🔗 *Short Link:* ${await shortUrl(link)}`
        await m.reply(caption)
    } catch (e) {
        await m.reply(`Error: ${e}`)
    }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl)$/i
handler.limit = true
export default handler

const formatBytes = (bytes) => 
    bytes === 0 ? '0 B' : `${(bytes / 1024 ** Math.floor(Math.log(bytes) / Math.log(1024))).toFixed(2)} ${['B', 'KB', 'MB', 'GB', 'TB'][Math.floor(Math.log(bytes) / Math.log(1024))]}`

const shortUrl = async (url) => {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
    return await res.text()
}
