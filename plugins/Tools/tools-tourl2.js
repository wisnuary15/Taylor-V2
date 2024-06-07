import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
const handler = async (m) => {
  try {
    const q = m.quoted || m
    const mime = q.mediaType || ''
    if (!/image|video|audio|sticker|document/.test(mime)) throw 'No media found'
    const media = await q?.download(true)
    const stats = fs.statSync(media)
    const fileSizeInBytes = stats.size
    if (fileSizeInBytes === 0) {
      m.reply('File kosong')
      await fs.promises.unlink(media)
      return
    }
    if (fileSizeInBytes > 1073741824) {
      m.reply('File terlalu besar, maksimal ukuran adalah 1 GB')
      await fs.promises.unlink(media)
      return
    }
    const {
      files
    } = await uploadUguu(media)
    const caption = `📮 *Link:*\n${files[0]?.url}`
    m.reply(caption)
  } catch (e) {
    m.reply(`Error: ${e}`)
  }
}
handler.help = ['tourl2']
handler.command = /^(tourl2)$/i
export default handler
const uploadUguu = async (path) => {
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
    await fs.promises.unlink(path)
    throw 'Upload failed'
  }
}
