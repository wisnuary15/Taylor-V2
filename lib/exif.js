import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import crypto from 'crypto';
import Ffmpeg from 'fluent-ffmpeg';
import webp from 'node-webpmux';
import path from 'path';

const generateRandomFileName = (extension) => path.join(tmpdir(), `${crypto.randomBytes(6).toString('hex')}.${extension}`);

const processMedia = async (media, extension, format) => {
    const tmpFileOut = generateRandomFileName(extension);
    const tmpFileIn = generateRandomFileName(format);

    await fs.writeFile(tmpFileIn, media);

    try {
        await new Promise((resolve, reject) => {
            Ffmpeg(tmpFileIn)
                .on('error', reject)
                .on('end', resolve)
                .addOutputOptions([
                    '-vcodec', 'libwebp',
                    '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                ])
                .toFormat('webp')
                .save(tmpFileOut);
        });

        const buff = await fs.readFile(tmpFileOut);
        await fs.unlink(tmpFileOut);
        await fs.unlink(tmpFileIn);
        return buff;
    } catch (error) {
        console.error(`Error in processMedia for ${extension}:`, error);
        throw error;
    }
};

const writeExif = async (media, metadata, isVideo = false) => {
    const tmpFileIn = generateRandomFileName('webp');
    const tmpFileOut = generateRandomFileName('webp');

    const wMedia = await processMedia(media, 'webp', isVideo ? 'mp4' : 'jpg');

    await fs.writeFile(tmpFileIn, wMedia);

    try {
        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = {
                'sticker-pack-id': `Secktor-SamPandey001`,
                'sticker-pack-name': metadata.packname,
                'sticker-pack-publisher': metadata.author,
                emojis: metadata.categories ? metadata.categories : [''],
            };
            const exifAttr = Buffer.from([
                0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
                0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
            ]);
            const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            await fs.unlink(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    } catch (error) {
        console.error(`Error in writeExif for ${isVideo ? 'video' : 'image'}:`, error);
        throw error;
    }
};

const imageToWebp = async (media) => await processMedia(media, 'webp', 'jpg');

const videoToWebp = async (media) => await processMedia(media, 'webp', 'mp4');

const writeExifImg = async (media, metadata) => await writeExif(media, metadata);

const writeExifVid = async (media, metadata) => await writeExif(media, metadata, true);

const writeExifWebp = async (media, metadata) => await writeExif(media, metadata);

export {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid,
    writeExifWebp,
};
