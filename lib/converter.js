import { createReadStream, promises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import Helper from './helper.js';

const __dirname = Helper.__dirname(import.meta.url);

function spawn_ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(__dirname, `../tmp/${Date.now()}.${ext}`);
      const out = `${tmp}.${ext2}`;

      const isStream = Helper.isReadableStream(buffer);
      if (isStream) await Helper.saveStreamToFile(buffer, tmp);
      else await promises.writeFile(tmp, buffer);

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ]);

      ffmpegProcess.once('error', (err) => {
        reject(err);
      });

      ffmpegProcess.once('close', async (code) => {
        try {
          await promises.unlink(tmp);
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
              await promises.unlink(out);
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

const defaultImageOptions = [
  "-vcodec", "libwebp",
  "-vf", "scale='min(320,iw)':'min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse"
];

const defaultVideoOptions = [
  "-vcodec", "libwebp",
  "-vf", "scale='min(320,iw)':'min(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse",
  "-loop", "0",
  "-ss", "00:00:00.0",
  "-t", "00:00:05.0",
  "-preset", "default",
  "-an",
  "-vsync", "0"
];

async function imageToWebp(buffer, options = {}) {
  return await(await spawn_ffmpeg(buffer, [...defaultImageOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'webp', 'webp')).toBuffer();
}

async function videoToWebp(buffer, options = {}) {
  return await(await spawn_ffmpeg(buffer, [...defaultVideoOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'webp', 'webp')).toBuffer();
}

async function toPTT(buffer, audioExt) {
  return await(await spawn_ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100'], audioExt, 'ogg')).toBuffer();
}

async function toAudio(buffer, audioExt) {
  return await(await spawn_ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100', '-ac', '2', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3')).toBuffer();
}

async function toAudio8k(buffer, audioExt) {
  return await(await spawn_ffmpeg(buffer, ['-af', 'apulsator=hz=0.125', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3')).toBuffer();
}

async function toVideo(buffer, videoExt) {
  return await(await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'slow', '-tune', 'film'], videoExt, 'mp4')).toBuffer();
}

async function toMp4(buffer, videoExt) {
  return await(await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', '-vf', 'crop=320:240', '-c:a', 'aac', '-b:a', '128k'], videoExt, 'mp4')).toBuffer();
}

async function videoConvert(buffer, options = []) {
  return await(await spawn_ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-tune', 'film', '-vf', 'scale=1280:-1', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', ...options], 'mp4', 'mp4')).toBuffer();
}

async function toGif(data) {
  try {
    const input = `./${randomBytes(3).toString('hex')}.webp`;
    const output = `./${randomBytes(3).toString('hex')}.gif`;
    await promises.writeFile(input, data);
    await new Promise((resolve, reject) => {
      const convertProcess = spawn('convert', [input, output]);
      convertProcess.once('error', reject);
      convertProcess.once('exit', () => resolve());
    });
    const result = await promises.readFile(output);
    await promises.unlink(input);
    await promises.unlink(output);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to convert to GIF');
  }
}

async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
  return await(await spawn_ffmpeg(buffer, args, ext, ext2)).toBuffer();
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
