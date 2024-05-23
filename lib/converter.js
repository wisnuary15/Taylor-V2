import {
    promises as fsPromises
} from 'fs';
import {
    join,
    dirname
} from 'path';
import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';
import {
    fileTypeFromBuffer
} from "file-type";
import {
    spawn
} from 'child_process';
import {
    once
} from 'events';
import {
    fileURLToPath
} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tmpDir = join(__dirname, '../tmp');

export async function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    try {
        const tmp = join(tmpDir, `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext}`);
        const out = `${tmp}.${ext2}`;

        await fsPromises.writeFile(tmp, buffer);

        const ffmpegProcess = await spawn('ffmpeg', ['-y', '-i', tmp, ...args, out]);
        const [code] = await once(ffmpegProcess, 'close');

        await fsPromises.unlink(tmp);

        if (code !== 0) {
            return await fluentFfmpeg(buffer, args, ext, ext2);
        } else {
            const data = await fsPromises.readFile(out);
            await fsPromises.unlink(out);
            return {
                data,
                filename: out,
                delete: async () => await fsPromises.unlink(out)
            };
        }
    } catch (error) {
        throw new Error(`Error in ffmpeg conversion: ${error.message}`);
    }
}

async function fluentFfmpeg(buffer, args = [], ext = '', ext2 = '') {
    try {
        const {
            ext: fileTypeExt,
            mime
        } = await fileTypeFromBuffer(buffer);
        const tmpFileOut = join(tmpDir, `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext2}`);
        const tmpFileIn = join(tmpDir, `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${fileTypeExt}`);

        await fsPromises.writeFile(tmpFileIn, buffer);

        await new Promise((resolve, reject) => {
            Ffmpeg(tmpFileIn)
                .inputFormat(mime.split('/')[1])
                .on("error", reject)
                .on("end", () => resolve(true))
                .addInput(tmpFileIn)
                .addOutputOptions(...args)
                .save(tmpFileOut);
        });

        const data = await fsPromises.readFile(tmpFileOut);
        await fsPromises.unlink(tmpFileOut);
        await fsPromises.unlink(tmpFileIn);
        return {
            data,
            filename: tmpFileOut,
            delete: async () => await fsPromises.unlink(tmpFileOut)
        };
    } catch (error) {
        throw new Error(`Error in fluent-ffmpeg conversion: ${error.message}`);
    }
}

export async function imageToWebp(buffer, options = {}) {
    const defaultOptions = [
        "-vcodec", "libwebp",
        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
    ];
    const args = [...defaultOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)];
    return await ffmpeg(buffer, args, 'webp', 'webp');
}

export async function videoToWebp(buffer, options = {}) {
    const defaultOptions = [
        "-vcodec", "libwebp",
        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
        "-loop", "0",
        "-ss", "00:00:00.0",
        "-t", "00:00:05.0",
        "-preset", "default",
        "-an",
        "-vsync", "0",
    ];
    const args = [...defaultOptions, ...Object.entries(options).map(([key, value]) => `${key}=${value}`)];
    return await ffmpeg(buffer, args, 'webp', 'webp');
}

export async function toPTT(buffer, audioExt) {
    return await ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100'], audioExt, 'ogg');
}

export async function toAudio(buffer, audioExt) {
    return await ffmpeg(buffer, ['-vn', '-ab', '128k', '-ar', '44100', '-ac', '2', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3');
}

export async function toAudio8k(buffer, audioExt) {
    return await ffmpeg(buffer, ['-af', 'apulsator=hz=0.125', '-codec:a', 'libmp3lame', '-b:a', '128k'], audioExt, 'mp3');
}

export async function toVideo(buffer, videoExt) {
    return await ffmpeg(buffer, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'slow', '-tune', 'film'], videoExt, 'mp4');
}

export async function toMp4(buffer, videoExt) {
    return await ffmpeg(buffer, [
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '23',
        '-movflags', '+faststart',
        '-vf', 'crop=320:240',
        '-c:a', 'aac',
        '-b:a', '128k'
    ], videoExt, 'mp4');
}

export async function videoConvert(buffer, options = []) {
    return await ffmpeg(buffer, [
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-crf', '18',
        '-preset', 'slow',
        '-tune', 'film',
        '-vf', 'scale=1280:-1',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '48000',
        ...options
    ], 'mp4', 'mp4');
}