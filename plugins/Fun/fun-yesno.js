import fetch from 'node-fetch'
import {
  Sticker,
  StickerTypes
} from 'wa-sticker-formatter'
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  args
}) => {
  m.react(wait)
  let res = await YesNo()
  let stiker = await createSticker(false, res.image, "Bot say ", (res.answer).toUpperCase(), 30)
  try {
    m.reply(stiker)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["yesno"]
handler.tags = ["fun"]
handler.command = /^(yesno)$/i
export default handler
async function YesNo() {
  const response = await fetch(`https://yesno.wtf/api`);
  const data = await response.json();
  return data;
}
async function createSticker(img, url, packName, authorName, quality) {
  let stickerMetadata = {
    type: 'full',
    pack: packName,
    author: authorName,
    quality
  }
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}
