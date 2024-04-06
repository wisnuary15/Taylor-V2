import {
    promises
} from 'fs'
import {
    join
} from 'path'
import {
    spawn
} from 'child_process'

function ffmpeg(buffer, args = [], ext = '', ext2 = '') {
    return new Promise(async (resolve, reject) => {
        try {
            let tmp = join(global.__dirname(import.meta.url), '../tmp', +new Date + '.' + ext)
            let out = tmp + '.' + ext2
            await promises.writeFile(tmp, buffer)
            spawn('ffmpeg', [
                    '-y',
                    '-i', tmp,
                    ...args,
                    out
                ])
                .on('error', reject)
                .on('close', async (code) => {
                    try {
                        await promises.unlink(tmp)
                        if (code !== 0) return reject(code)
                        resolve({
                            data: await promises.readFile(out),
                            filename: out,
                            delete() {
                                return promises.unlink(out)
                            }
                        })
                    } catch (e) {
                        reject(e)
                    }
                })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Convert Audio to Playable WhatsApp Audio
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toPTT(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
    ], ext, 'ogg')
}

/**
 * Convert Audio to Playable WhatsApp PTT
 * @param {Buffer} buffer Audio Buffer
 * @param {String} ext File Extension 
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toAudio(buffer, ext) {
    return ffmpeg(buffer, [
        '-vn',
        '-c:a', 'libopus',
        '-b:a', '128k',
        '-vbr', 'on',
        '-compression_level', '10'
    ], ext, 'opus')
}

/**
 * Convert Audio to Playable WhatsApp Video
 * @param {Buffer} buffer Video Buffer
 * @param {String} ext File Extension 
 * @returns {Promise<{data: Buffer, filename: String, delete: Function}>}
 */
function toVideo(buffer, ext) {
    return ffmpeg(buffer, [
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-ab', '128k',
        '-ar', '44100',
        '-crf', '32',
        '-preset', 'slow'
    ], ext, 'mp4')
}

/**
 * Mengkonversi video ke resolusi dan bitrate yang diinginkan.
 * @param {Buffer} buffer Buffer video input.
 * @param {string} resolution Resolusi video (contoh: '1280x720').
 * @param {string} videoBitrate Bitrate video (contoh: '2000k').
 * @returns {Promise<Buffer>} Buffer video hasil konversi.
 */
function videoConvert(buffer, input = []) {
    return new Promise(async (resolve, reject) => {
        try {
            const tmp = join(__dirname, '../tmp', `${+new Date()}.mp4`);
            await promises.writeFile(tmp, buffer);
            const out = tmp.replace('.mp4', '_converted.mp4');
            const args = [
                '-y',
                '-i', tmp,
                ...input,
                out
            ];

            spawn('ffmpeg', args)
                .on('error', reject)
                .on('close', async (code) => {
                    try {
                        await promises.unlink(tmp);
                        if (code !== 0) return reject(code);
                        const outputVideoBuffer = await promises.readFile(out);
                        await promises.unlink(out);
                        resolve(outputVideoBuffer);
                    } catch (e) {
                        reject(e);
                    }
                });
        } catch (e) {
            reject(e);
        }
    });
}

const defaultOptions = ['-hide_banner'];

function ffmpegCommand(input, output, ...options) {
    return ffmpeg(input, [...defaultOptions, ...options], output);
}

function basicConversion(inputPath, outputExt) {
    return ffmpegCommand(inputPath, outputExt);
}

function cropVideo(inputPath, outputExt, ...cropOptions) {
    return ffmpegCommand(inputPath, outputExt, '-filter:v', `crop=${cropOptions.join(':')}`);
}

function scaleVideo(inputBuffer, scale) {
    const options = ['-vf', `scale=${scale}`];
    return ffmpegCommand(inputBuffer, 'mp4', ...options);
}

function trimVideo(inputPath, outputExt, startTime, endTime) {
    return ffmpegCommand(inputPath, outputExt, '-ss', startTime, '-c', 'copy', '-t', endTime);
}

function convertToFLV(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'flv', '-c:v', 'flv');
}

function convertToMKV(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'mkv', '-c:v', 'libx264');
}

function convertToGIF(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'gif', '-c:v', 'gif');
}

function copyToAAC(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'aac', '-vn', '-acodec', 'copy');
}

function convertToMP3(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'mp3', '-vn', '-acodec', 'mp3');
}

function convertToAAC(inputPath, outputExt) {
    return ffmpegCommand(inputPath, 'aac', '-vn', '-acodec', 'aac');
}

function trimAudioToMP3(inputPath, outputExt, startTime, endTime) {
    return ffmpegCommand(inputPath, 'mp3', '-ss', startTime, '-t', endTime, '-vn', '-acodec', 'mp3');
}

function extractFramesToImages(inputPath, outputExt, frameRate) {
    return ffmpegCommand(inputPath, 'jpg', '-vf', `fps=${frameRate}`);
}

function extractFramesToPNG(inputPath, outputExt, frameRate) {
    return ffmpegCommand(inputPath, 'png', '-vf', `fps=${frameRate}`);
}

function addWatermark(inputPath, outputExt, watermarkPath, position) {
    return ffmpegCommand(
        inputPath,
        outputExt,
        '-i', watermarkPath,
        '-filter_complex', `overlay=${position}`,
        '-codec:a', 'copy'
    );
}

function mergeVideos(inputPaths, outputExt) {
    const inputFiles = inputPaths.map((path) => `-i ${path}`).join(' ');
    return ffmpegCommand(
        inputFiles,
        outputExt,
        '-filter_complex', `concat=n=${inputPaths.length}:v=1:a=1[outv][outa]`,
        '-map', '[outv]',
        '-map', '[outa]'
    );
}

function extractAudio(inputPath, outputExt) {
    return ffmpegCommand(inputPath, outputExt, '-vn', '-acodec', 'copy');
}

function reverseVideo(inputPath, outputExt) {
    return ffmpegCommand(inputPath, outputExt, '-vf', 'reverse', '-af', 'areverse');
}

function resizeImage(inputPath, outputExt, width, height) {
    return ffmpegCommand(inputPath, outputExt, '-vf', `scale=${width}:${height}`);
}

function applyFilterToAudio(inputPath, outputExt, filter) {
    return ffmpegCommand(inputPath, outputExt, '-af', filter);
}

function extractSingleFrame(inputPath, outputExt, time) {
    return ffmpegCommand(inputPath, outputExt, '-ss', time, '-vframes', '1');
}

function extractAudioWaveform(inputPath, outputExt, resolution = 1920) {
    return ffmpegCommand(
        inputPath,
        outputExt,
        '-filter_complex', `aformat=channel_layouts=stereo,showwavespic=s=${resolution}x240:colors=0x00FF00`
    );
}

function concatenateVideos(inputPaths, outputExt) {
    const inputFiles = inputPaths.map((path) => `-i ${path}`).join(' ');
    return ffmpegCommand(inputFiles, outputExt, '-filter_complex', `concat=n=${inputPaths.length}:v=1:a=1[outv][outa]`, '-map', '[outv]', '-map', '[outa]');
}

export {
    ffmpegCommand,
    basicConversion,
    cropVideo,
    scaleVideo,
    trimVideo,
    convertToFLV,
    convertToMKV,
    convertToGIF,
    copyToAAC,
    convertToMP3,
    convertToAAC,
    trimAudioToMP3,
    extractFramesToImages,
    extractFramesToPNG,
    addWatermark,
    mergeVideos,
    extractAudio,
    reverseVideo,
    resizeImage,
    applyFilterToAudio,
    extractSingleFrame,
    extractAudioWaveform,
    concatenateVideos
};

export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg,
    videoConvert
}