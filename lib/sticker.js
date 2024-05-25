import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { exec } from "child_process";
import path from "path";
import crypto from "crypto";
import { fetch } from "undici";
import axios from "axios";
import Jimp from "jimp";
import { ImageProcessor } from "./tools/imgonline.js";
import { Uploader } from "./tools/uploader.js";
import { ffmpeg } from "./converter.js";
import {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid,
  writeExifWebp,
} from "./exif.js";
import fluent_ffmpeg from "fluent-ffmpeg";
import { spawn } from "child_process";
import { fileTypeFromBuffer } from "file-type";
import webp from "node-webpmux";
import Sticker from "wa-sticker-formatter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmp = path.join(__dirname, "../tmp");

const sticker1 = async (img, url) => {
  try {
    img = img || await (await fetch(url)).arrayBuffer();
    const convert = new ImageProcessor();
    const output = await convert.convertImage(img, '10');
    if (!output.url[0]) throw new Error("Error Convert");
    return await (await fetch(output.url[0])).arrayBuffer();
  } catch (error) {
    console.error("Error in sticker1:", error);
    throw error;
  }
};

const sticker2 = async (img, url) => {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw await res.text();
      img = Buffer.from(await res.arrayBuffer());
    }
    const inp = path.join(tmp, `${Date.now()}.jpeg`);
    await fs.writeFile(inp, img);

    return new Promise((resolve, reject) => {
      const ff = spawn("ffmpeg", [
        "-y", "-i", inp, "-vf",
        "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1",
        "-f", "png", "-"
      ]);

      const bufs = [];
      const im = spawn("convert", ["png:-", "webp:-"]);
      ff.on("error", reject);
      ff.on("close", async () => await fs.unlink(inp));
      im.on("error", reject);
      im.stdout.on("data", (chunk) => bufs.push(chunk));
      ff.stdout.pipe(im.stdin);
      im.on("exit", () => resolve(Buffer.concat(bufs)));
    });
  } catch (error) {
    console.error("Error in sticker2:", error);
    throw error;
  }
};

const sticker3 = async (img, url, packname, author) => {
  try {
    if (!img) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      img = await response.arrayBuffer();
    }

    const image = await Jimp.read(Buffer.from(img));
    const mime = image.getMIME ? image.getMIME() : Jimp.MIME_WEBP;
    image.exifData = { artist: author, software: "Jimp", comment: packname };
    return await image.getBufferAsync(mime);
  } catch (error) {
    console.error("Error in sticker3:", error);
    throw error;
  }
};

const sticker4 = async (img, url) => {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw await res.text();
      img = Buffer.from(await res.arrayBuffer());
    }
    return await ffmpeg(
      img,
      ["-vf", "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1"],
      "jpeg",
      "webp"
    );
  } catch (error) {
    console.error("Error in sticker4:", error);
    throw error;
  }
};

const sticker5 = async (input, packname, author, categories = ["🦆", "🐦", "🗿", "🤖"], extra = {}) => {
  try {
    let media;
    if (Buffer.isBuffer(input)) {
      media = input;
    } else if (typeof input === "string" && input.startsWith("http")) {
      const response = await axios.get(input, { responseType: "arraybuffer" });
      media = Buffer.from(response.data, "binary");
    } else {
      throw new Error("Invalid input type");
    }

    const sticker = new Sticker(media, { type: "default", pack: packname, author, categories, ...extra });
    if (extra.exifData) sticker.setMetadata(extra.exifData);
    return sticker.toBuffer("webp");
  } catch (error) {
    console.error("Error in sticker5:", error);
    throw error;
  }
};

const sticker6 = async (img, url) => {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw await res.text();
      img = Buffer.from(await res.arrayBuffer());
    }
    const type = (await fileTypeFromBuffer(img)) || { mime: "application/octet-stream", ext: "bin" };
    if (type.ext === "bin") throw new Error("Invalid file type");

    const tmpPath = path.join(tmp, `${Date.now()}.${type.ext}`);
    const outPath = `${tmpPath}.webp`;
    await fs.writeFile(tmpPath, img);

    return new Promise((resolve, reject) => {
      const Fffmpeg = /video/i.test(type.mime) ? fluent_ffmpeg(tmpPath).inputFormat(type.ext) : fluent_ffmpeg(tmpPath).input(tmpPath);

      Fffmpeg.on("error", reject)
        .on("end", async () => {
          await fs.unlink(tmpPath);
          resolve(await fs.readFile(outPath));
        })
        .addOutputOptions([
          "-vcodec", "libwebp",
          "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
        ])
        .toFormat("webp")
        .save(outPath);
    });
  } catch (error) {
    console.error("Error in sticker6:", error);
    throw error;
  }
};

const sticker7 = async (input) => {
  try {
    const buffer = typeof input === "string" ? Buffer.from((await axios.get(input, { responseType: "arraybuffer" })).data) : input;
    const result = upload.uploadPomf2 ? await upload.uploadPomf2(buffer) :
                  upload.hostfile ? await upload.hostfile(buffer) :
                  upload.catbox ? await upload.catbox(buffer) :
                  upload.mediaUpload ? await upload.mediaUpload(buffer) :
                  (() => { throw new Error("No suitable upload method found."); })();
    return `https://wsrv.nl/?url=${result}&output=webp`;
  } catch (error) {
    console.error("Error in sticker7:", error);
    throw error;
  }
};

const sticker8 = async (img, url, packname, author) => {
  try {
    img = img || await (await fetch(url)).arrayBuffer();
    const type = (await fileTypeFromBuffer(img)) || { mime: "application/octet-stream", ext: "bin" };

    const output = /^video\//.test(type.mime) ? await writeExifVid(img, { packname, author }) :
                   /^image\/webp$/.test(type.mime) ? await writeExifWebp(img, { packname, author }) :
                   /^image\//.test(type.mime) ? await writeExifImg(img, { packname, author }) :
                   null;

    if (!output) throw new Error("Error Convert");
    return output;
  } catch (error) {
    console.error("Error in sticker8:", error);
    throw error;
  }
};

const sticker9 = async (filePath, packname = global.packname, author = global.author) => {
  try {
    await exec(`webpmux -set exif ${addMetadata(packname, author)} ${filePath} -o ${filePath}`);
    return await fs.readFile(filePath);
  } catch (error) {
    console.error("Error in sticker9:", error);
    return await fs.readFile(filePath);
  }
};

const addExif = async (webpSticker, packname, author, categories = ["🦆", "🐦", "🗿", "🤖"], extra = {}) => {
  try {
    const img = new webp.Image();
    const stickerPackId = crypto.randomBytes(32).toString("hex");
    const json = {
      "sticker-pack-id": stickerPackId,
      "sticker-pack-name": packname,
      "sticker-pack-publisher": author,
      emojis: categories,
      ...extra,
    };

    const exifAttr = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), "utf8");
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);

    await img.load(webpSticker);
    img.exif = exif;
    return await img.save(null);
  } catch (error) {
    console.error("Error in addExif:", error);
    throw error;
  }
};

const sticker = async (img, url, ...args) => {
  let lastError;
  for (const func of [sticker8, support.ffmpeg && sticker2, support.ffmpeg && sticker4, sticker5, support.ffmpeg && sticker6, sticker3, sticker1, sticker7, sticker9].filter(Boolean)) {
    try {
      const stiker = await func(img, url, ...args);
      if (stiker.includes("WEBP")) {
        try {
          return await addExif(stiker, ...args);
        } catch (e) {
          console.error(e);
          return stiker;
        }
      }
      if (stiker.includes("html")) continue;
      throw new Error(stiker.toString());
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  console.error(lastError);
  throw new Error(lastError);
};

const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false,
};

export {
  sticker,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker6,
  sticker7,
  sticker8,
  sticker9,
  addExif,
  support,
};
