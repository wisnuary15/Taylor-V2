import fs from 'fs';
import { tmpdir } from 'os';
import Crypto from 'crypto';
import ff from 'fluent-ffmpeg';
import webp from 'node-webpmux';
import path from 'path';

async function writeExifImg(media, metadata) {
    try {
        let wMedia = await imageToWebp(media);
        const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = { "sticker-pack-id": `https://github.com/AyGemuy/Taylor-V2`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] };
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error writing EXIF data for image.");
    }
}

async function writeExifVid(media, metadata) {
    try {
        let wMedia = await videoToWebp(media);
        const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = { "sticker-pack-id": `https://github.com/AyGemuy/Taylor-V2`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] };
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error writing EXIF data for video.");
    }
}

async function writeExif(media, metadata) {
    try {
        let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : "";
        const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = { "sticker-pack-id": `https://github.com/AyGemuy/Taylor-V2`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] };
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error writing EXIF data.");
    }
}

async function writeExifWebp(media, metadata) {
    try {
        let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : "";
        const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
        fs.writeFileSync(tmpFileIn, wMedia);

        if (metadata.packname || metadata.author) {
            const img = new webp.Image();
            const json = { "sticker-pack-id": `https://github.com/AyGemuy/Taylor-V2`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] };
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
            const exif = Buffer.concat([exifAttr, jsonBuff]);
            exif.writeUIntLE(jsonBuff.length, 14, 4);
            await img.load(tmpFileIn);
            fs.unlinkSync(tmpFileIn);
            img.exif = exif;
            await img.save(tmpFileOut);
            return tmpFileOut;
        }
    } catch (error) {
        console.error(error);
        throw new Error("Error writing EXIF data for WebP.");
    }
}

export { writeExifImg, writeExifVid, writeExif, writeExifWebp };
