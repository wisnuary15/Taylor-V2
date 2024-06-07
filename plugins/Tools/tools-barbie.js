import axios from 'axios';
import {
  FormData,
  Blob
} from 'formdata-node';
import {
  fileTypeFromBuffer
} from 'file-type';
import {
  createHash
} from 'crypto';
async function Barbie(input) {
  try {
    const data = Buffer.isBuffer(input) ? input : Buffer.from((await axios.get(input, {
      responseType: 'arraybuffer'
    })).data);
    const {
      ext,
      mime
    } = await fileTypeFromBuffer(data) || {
      ext: 'jpg',
      mime: 'image/jpg'
    };
    const hash = createHash('sha256').update(data).digest('hex');
    const filename = `${hash}.${ext}`;
    const formData = new FormData();
    formData.append('myfile', new Blob([data], {
      type: mime
    }), filename);
    const headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      'Origin': 'https://www.barbieselfie.ai',
      'Referer': 'https://www.barbieselfie.ai/intl/step/loading/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
    };
    const response = await axios.post('https://www.barbieselfie.ai/api/upload.php', formData, {
      headers,
      responseType: 'arraybuffer',
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw 'No media found';
  let media = await q?.download();
  let isImage = /^image\/(png|jpe?g)/.test(mime);
  if (!isImage) throw 'No image found';
  m.reply('Processing image, please wait...');
  try {
    let resultImage = await Barbie(media);
    await conn.sendMessage(m.chat, {
      image: resultImage,
      caption: 'Here is your Barbie image!'
    }, {
      quoted: m
    });
  } catch (e) {
    m.reply('Failed to process image.');
  }
};
handler.help = ["barbie *[Reply image]*"];
handler.tags = ["tools"];
handler.command = /^(barbie)$/i;
export default handler;
