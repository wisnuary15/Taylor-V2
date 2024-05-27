import { createReadStream, promises as fsPromises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import Helper from './helper.js';
import axios from 'axios';
import cheerio from 'cheerio';
import BodyForm from 'form-data';
import { fileURLToPath } from 'url';
import fluent_ffmpeg from 'fluent-ffmpeg';

const __dirname = Helper.__dirname(import.meta.url);

async function spawn_ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(__dirname, `../tmp/${Date.now()}.${ext}`);
      const out = `${tmp}.${ext2}`;

      const isStream = Helper.isReadableStream(buffer);
      if (isStream) await Helper.saveStreamToFile(buffer, tmp);
      else await fsPromises.writeFile(tmp, buffer);

      const ffmpegProcess = spawn('ffmpeg', ['-y', '-i', tmp, ...args, out]);

      ffmpegProcess.once('error', async (err) => {
        console.error('FFmpeg spawn error, trying fluent-ffmpeg:', err);
        try {
          await fsPromises.unlink(tmp);
        } catch (e) {
          console.error('Error deleting temporary file:', e);
        }
        return fallback_ffmpeg(tmp, args, ext2).then(resolve).catch(reject);
      });

      ffmpegProcess.once('close', async (code) => {
        try {
          await fsPromises.unlink(tmp);
          if (code !== 0) return reject(new Error(`FFmpeg process exited with code ${code}`));
          const data = createReadStream(out);
          resolve({
            data,
            filename: out,
            async toBuffer() {
              const buffers = [];
              for await (const chunk of data) buffers.push(chunk);
              return Buffer.concat(buffers);
            },
            async clear() {
              data.destroy();
              await fsPromises.unlink(out);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function fallback_ffmpeg(inputFile, args, outputExt) {
  return new Promise((resolve, reject) => {
    const outputFile = `${inputFile}.${outputExt}`;
    const command = fluent_ffmpeg(inputFile)
      .outputOptions(args)
      .output(outputFile)
      .on('end', async () => {
        const data = createReadStream(outputFile);
        resolve({
          data,
          filename: outputFile,
          async toBuffer() {
            const buffers = [];
            for await (const chunk of data) buffers.push(chunk);
            return Buffer.concat(buffers);
          },
          async clear() {
            data.destroy();
            await fsPromises.unlink(outputFile);
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });

    command.run();
  });
}

const defaultImageOptions = [
  '-vcodec', 'libwebp',
  '-vf', "scale='min(320,iw)':'min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse"
];

const defaultVideoOptions = [
  '-vcodec', 'libwebp',
  '-vf', "scale='min(320,iw)':'min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
  '-loop', '0',
  '-ss', '00:00:00.0',
  '-t', '00:00:05.0',
  '-preset', 'default',
  '-an',
  '-vsync', '0'
];

async function imageToWebp(buffer, options = {}) {
  return await(await spawn_ffmpeg(buffer, [...defaultImageOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'jpg', 'webp')).toBuffer();
}

async function videoToWebp(buffer, options = {}) {
  return await(await spawn_ffmpeg(buffer, [...defaultVideoOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'mp4', 'webp')).toBuffer();
}

async function toPTT(buffer, audioExt) {
  return (await spawn_ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100'], audioExt, 'ogg'));
}

async function toAudio(buffer, audioExt) {
  return (await spawn_ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100', '-ac', '2', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3'));
}

async function toAudio8k(buffer, audioExt) {
  return (await spawn_ffmpeg(buffer, ['-af', 'apulsator=hz=0.125', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3'));
}

async function toVideo(buffer, videoExt) {
  return (await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'slow', '-tune', 'film'], videoExt, 'mp4'));
}

async function toMp4(buffer, videoExt) {
  return (await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', '-vf', 'crop=320:240', '-c:a', 'aac', '-b:a', '128k'], videoExt, 'mp4'));
}

async function videoConvert(buffer, options = []) {
  return (await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-tune', 'film', '-vf', 'scale=1280:-1', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', ...options], 'mp4', 'mp4'));
}

async function toGif(data) {
  try {
    const input = `./${randomBytes(3).toString('hex')}.webp`;
    const output = `./${randomBytes(3).toString('hex')}.gif`;
    await fsPromises.writeFile(input, data);
    await new Promise((resolve, reject) => {
      const convertProcess = spawn('convert', [input, output]);
      convertProcess.once('error', reject);
      convertProcess.once('exit', () => resolve());
    });
    const result = await fsPromises.readFile(output);
    await fsPromises.unlink(input);
    await fsPromises.unlink(output);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to convert to GIF');
  }
}

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return (await spawn_ffmpeg(buffer, args, ext, ext2));
}

export {
  imageToWebp,
  videoToWebp,
  toPTT,
  toAudio,
  toAudio8k,
  toVideo,
  toMp4,
  videoConvert,
  toGif,
  ffmpeg
};

const webp2mp4File = (source) => {
  return new Promise((resolve, reject) => {
    const form = new BodyForm();
    const isUrl = typeof source === 'string' && /https?:\/\//.test(source);
    form.append('new-image-url', isUrl ? source : "");
    form.append('new-image', isUrl ? "" : source, "image.webp");

    axios.post('https://s6.ezgif.com/webp-to-mp4', form, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${form._boundary}`
      }
    }).then(({ data }) => {
      const bodyFormThen = new BodyForm();
      const $ = cheerio.load(data);
      const file = $('input[name="file"]').attr('value');
      bodyFormThen.append('file', file);
      bodyFormThen.append('convert', "Convert WebP to MP4!");

      axios.post(`https://ezgif.com/webp-to-mp4/${file}`, bodyFormThen, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
        }
      }).then(({ data }) => {
        const $ = cheerio.load(data);
        const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
        resolve(result);
      }).catch(reject);
    }).catch(reject);
  });
};

const openwaSticker = (buffer, mime = "image/jpg", options = {}) => {
  return new Promise((resolve, reject) => {
    axios.post(`https://sticker-api.openwa.dev/${mime.startsWith("image") ? "prepareWebp" : "convertMp4BufferToWebpDataUrl"}`, {
      maxBodyLength: 20000000,
      maxContentLength: 1500000,
      headers: {
        'Accept': "application/json, text/plain, */*",
        'Content-Type': "application/json;charset=utf-8",
        'User-Agent': "WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
      },
      data: JSON.stringify(Object.assign(options, { [`${mime.startsWith("image") ? "image" : "file"}`]: `data:${mime};base64,${buffer.toString("base64")}` }))
    }).then(({ data }) => {
      resolve(mime.startsWith("image") ? data.webpBase64 : data);
    }).catch(reject);
  });
};

const TelegraPh = (Path) => {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(Path)) return reject(new Error("File not Found"));
    try {
      const form = new BodyForm();
      form.append("file", fs.createReadStream(Path));
      const { data } = await axios.post("https://telegra.ph/upload", form, {
        headers: {
          ...form.getHeaders()
        }
      });
      resolve("https://telegra.ph" + data[0].src);
    } catch (err) {
      reject(new Error(String(err)));
    }
  });
};

const UploadFileUgu = (input) => {
  return new Promise(async (resolve, reject) => {
    const form = new BodyForm();
    form.append("files[]", fs.createReadStream(input));
    axios.post("https://uguu.se/upload.php", form, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        ...form.getHeaders()
      }
    }).then(({ data }) => {
      resolve(data.files[0]);
    }).catch(reject);
  });
};

export { webp2mp4File, openwaSticker, TelegraPh, UploadFileUgu };
