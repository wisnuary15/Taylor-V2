import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';
import { fileTypeFromBuffer } from 'file-type';
import { spawn } from 'child_process';
import { once } from 'events';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tmpDir = join(__dirname, '../tmp');

const spawnFfmpeg = async (buffer, args = [], ext = '', ext2 = '') => {
    const tmp = join(tmpDir, `${crypto.randomBytes(6).toString('hex')}.${ext}`);
    const out = `${tmp}.${ext2}`;
    await fs.writeFile(tmp, buffer);

    try {
        const ffmpegProcess = spawn('ffmpeg', ['-y', '-i', tmp, ...args, out]);
        const [code] = await once(ffmpegProcess, 'close');
        await fs.unlink(tmp);

        return code !== 0 ? fluentFfmpeg(buffer, args, ext, ext2) : await readFileAndDelete(out);
    } catch (error) {
        throw new Error(`Error in ffmpeg conversion: ${error.message}`);
    }
};

const fluentFfmpeg = async (buffer, args = [], ext = '', ext2 = '') => {
    const { ext: fileTypeExt, mime } = await fileTypeFromBuffer(buffer);
    const tmpFileIn = join(tmpDir, `${crypto.randomBytes(6).toString('hex')}.${fileTypeExt}`);
    const tmpFileOut = join(tmpDir, `${crypto.randomBytes(6).toString('hex')}.${ext2}`);

    await fs.writeFile(tmpFileIn, buffer);

    try {
        await new Promise((resolve, reject) => {
            Ffmpeg(tmpFileIn)
                .inputFormat(mime.split('/')[1])
                .on("error", reject)
                .on("end", resolve)
                .addInput(tmpFileIn)
                .addOutputOptions(...args)
                .save(tmpFileOut);
        });

        return await readFileAndDelete(tmpFileOut);
    } catch (error) {
        throw new Error(`Error in fluent-ffmpeg conversion: ${error.message}`);
    }
};

const readFileAndDelete = async (file) => {
    const data = await fs.readFile(file);
    await fs.unlink(file);
    return { data, filename: file, delete: async () => await fs.unlink(file) };
};

const defaultImageOptions = [
    "-vcodec", "libwebp",
    "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
];

const defaultVideoOptions = [
    "-vcodec", "libwebp",
    "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
    "-loop", "0",
    "-ss", "00:00:00.0",
    "-t", "00:00:05.0",
    "-preset", "default",
    "-an",
    "-vsync", "0"
];

export const imageToWebp = async (buffer, options = {}) => await spawnFfmpeg(buffer, [...defaultImageOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'webp', 'webp');
export const videoToWebp = async (buffer, options = {}) => await spawnFfmpeg(buffer, [...defaultVideoOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)], 'webp', 'webp');
export const toPTT = async (buffer, audioExt) => await spawnFfmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100'], audioExt, 'ogg');
export const toAudio = async (buffer, audioExt) => await spawnFfmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100', '-ac', '2', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3');
export const toAudio8k = async (buffer, audioExt) => await spawnFfmpeg(buffer, ['-af', 'apulsator=hz=0.125', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3');
export const toVideo = async (buffer, videoExt) => await spawnFfmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'slow', '-tune', 'film'], videoExt, 'mp4');
export const toMp4 = async (buffer, videoExt) => await spawnFfmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-movflags', '+faststart', '-vf', 'crop=320:240', '-c:a', 'aac', '-b:a', '128k'], videoExt, 'mp4');
export const videoConvert = async (buffer, options = []) => await spawnFfmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-tune', 'film', '-vf', 'scale=1280:-1', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', ...options], 'mp4', 'mp4');
export const ffmpeg = async (buffer, args = [], ext = '', ext2 = '') => await spawnFfmpeg(buffer, args, ext, ext2);
