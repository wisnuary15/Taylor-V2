import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

const handler = async (m) => {
    try {
        const q = m.quoted || m
        const mime = q.mediaType || ''
        if (!/image|video|audio|sticker|document/.test(mime)) throw 'No media found'

        const media = await q.download(true)
        const { files } = await uploadFile(media)
        await m.reply(files[0].url)
    } catch (e) {
        await m.reply(`Error: ${e}`)
    }
}

handler.help = ['tourl2']
handler.command = /^(tourl2)$/i
export default handler

const uploadFile = async (path) => {
    try {
        const form = new FormData()
        form.append('files[]', fs.createReadStream(path))
        const res = await fetch('https://uguu.se/upload.php', {
            method: 'POST',
            headers: form.getHeaders(),
            body: form
        })
        const json = await res.json()
        await fs.promises.unlink(path)
        return json
    } catch (e) {
        throw 'Upload failed'
    }
}
