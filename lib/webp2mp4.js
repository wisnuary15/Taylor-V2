import { convert } from "./tools/ezgif-convert.js";
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";

const randomBytes = crypto.randomBytes(5).toString("hex");
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

async function convertWithFallback(source, types) {
    const isUrl = typeof source === 'string' && urlRegex.test(source);
    const options = isUrl ? { url: source } : {
        file: new Blob([source]),
        filename: randomBytes + "." + (await fileTypeFromBuffer(source)).ext
    };

    for (const type of types) {
        try {
            return await convert({ type, ...options });
        } catch (error) {
            console.error(`Error converting to ${type}.`, error);
        }
    }
    throw new Error(`All conversions failed for types: ${types.join(', ')}`);
}

const webp2mp4 = async (source) => await convertWithFallback(source, ['webp-mp4', 'webp-avif', 'webp-gif']);
const webp2png = async (source) => await convertWithFallback(source, ['webp-png', 'webp-jpg']);
const video2Webp = async (source) => await convertWithFallback(source, ['video-webp', 'gif-webp']);
const image2Webp = async (source) => await convertWithFallback(source, ['jpg-webp', 'png-webp']);

export {
    webp2mp4,
    webp2png,
    video2Webp,
    image2Webp
};
