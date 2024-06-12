import {
  fileURLToPath
} from 'url'
import {
  ffmpeg as ffmpegConv,
  toSticker,
  openwaSticker,
  StickerTypes as _StickerTypes,
  imageToWebp,
  videoToWebp,
  mp42webp, png2webp
} from './converter.js'
import {
  video2Webp as _video2webp,
  image2Webp as _image2Webp
} from './webp2mp4.js'
import uploadFile from './uploadFile.js'
import uploadImage from './uploadImage.js'
import {
  tmpdir
} from 'os'
import {
  Sticker,
  createSticker,
  StickerTypes
} from 'wa-sticker-formatter';
import {
  spawn
} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import Fluent_Ffmpeg from 'fluent-ffmpeg';
import {
  fileTypeFromBuffer
} from 'file-type';
import webpmux from 'node-webpmux';
const {
  Image,
  WebPMux
} = webpmux;
import crypto from 'crypto';
import {
  Buffer
} from 'buffer';
import sharp from 'sharp';
import {
  isBuffer
} from 'util';
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(__dirname, '../tmp')
async function sticker1(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const type = await fileTypeFromBuffer(Buffer.from(media)) || {
      mime: 'image/jpg',
      ext: 'jpg'
    };
    const sticker = await openwaSticker((Buffer.from(media)), type.mime);
    if (sticker) {
      return sticker;
    }
    return await _image2Webp(Buffer.from(media)) || await imageToWebp(Buffer.from(media));
  } catch (error) {
    console.error('Error in sticker1:', error);
    throw error;
  }
}
/**
 * Image to Sticker
 * @param {Buffer} media Image Buffer
 * @param {String} url Image URL
 */
async function sticker2(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(await res.text());
      media = await res.arrayBuffer();
    }
    const inp = path.join(tmp, `${Date.now()}.jpeg`);
    await fs.promises.writeFile(inp, (Buffer.from(media)));
    const ffmpegSpawn = spawn('ffmpeg', [
    '-y',
    '-i', inp,
    '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=#00000000,setsar=1`,
    '-f', 'webp',
    '-'
]);
    ffmpegSpawn.on('error', (err) => {
      throw new Error(`FFmpeg error: ${err.message}`);
    });
    const ffBuffer = await new Promise((resolve, reject) => {
      const bufs = [];
      ffmpegSpawn.stdout.on('data', (chunk) => bufs.push(chunk));
      ffmpegSpawn.stdout.on('end', () => resolve(Buffer.concat(bufs)));
      ffmpegSpawn.stderr.on('data', (err) => reject(new Error(`FFmpeg stderr: ${err.toString()}`)));
    });
    await fs.promises.unlink(inp);
    const imArgs = [...((module.exports.support.gm ? ['gm'] : module.exports.magick ? ['magick'] : [])), 'convert',
      'png:-', 'webp:-'
    ];
    const im = spawn(imArgs[0], imArgs.slice(1));
    im.on('error', (err) => {
      throw new Error(`ImageMagick error: ${err.message}`);
    });
    const imBuffer = await new Promise((resolve, reject) => {
      const bufs = [];
      im.stdout.on('data', (chunk) => bufs.push(chunk));
      im.stdout.on('end', () => resolve(Buffer.concat(bufs)));
      im.stdin.on('error', (err) => reject(new Error(`ImageMagick stdin error: ${err.message}`)));
      im.stderr.on('data', (err) => reject(new Error(`ImageMagick stderr: ${err.toString()}`)));
      im.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`ImageMagick exited with code ${code}`));
        }
      });
    });
    im.stdin.write(ffBuffer);
    im.stdin.end();
    return imBuffer;
  } catch (e) {
    console.error('Error in sticker2:', e);
    throw e;
  }
}
async function sticker3(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const type = await fileTypeFromBuffer(Buffer.from(media)) || {
      mime: 'video/mp4',
      ext: 'mp4'
    };
    if (!/video/.test(type.mime)) {
      throw new Error('Provided file is not a video');
    }
    return await _video2webp(Buffer.from(media)) || await video2webp(Buffer.from(media)) || await video2webp30(Buffer.from(media)) || await video2webp45(Buffer.from(media)) || await video2webp60(Buffer.from(media));
  } catch (error) {
    console.error('Error in sticker3:', error);
    throw error;
  }
}
/**
 * Image to Sticker
 * @param {Buffer} media Image/Video Buffer
 * @param {String} url Image/Video URL
 */
async function sticker4(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const ffmpegArgs = [
    '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=#00000000,setsar=1`
];
        const type = await fileTypeFromBuffer(Buffer.from(media)) || {
      ext: 'jpeg'
    };
    return await (await ffmpegConv((Buffer.from(media)), ffmpegArgs, type.ext, 'webp')).toBuffer();
  } catch (error) {
    console.error('Error in sticker4:', error);
    throw error;
  }
}
async function sticker5(media, url, packname, author, categories = [''], extra = {}) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(await res.text());
      media = await res.arrayBuffer();
    }
    const stickerMetadata = {
      type: StickerTypes.FULL,
      pack: packname,
      author,
      categories,
      ...extra
    };
    const source = media || url;
    if (!source) {
      throw new Error('Either media or url must be provided.');
    }
    const sticker = new Sticker(source, stickerMetadata);
    return await createSticker(source) || await sticker.toBuffer();
  } catch (error) {
    console.error('Error creating sticker:', error);
    throw error;
  }
}
/**
 * Convert using fluent-ffmpeg
 * @param {string} media 
 * @param {string} url 
 */
async function sticker6(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(await res.text());
      media = await res.arrayBuffer();
    }
    const type = await fileTypeFromBuffer(Buffer.from(media)) || {
      mime: 'application/octet-stream',
      ext: 'bin'
    };
    if (type.ext === 'bin') throw new Error('Unsupported file type');
    const tmpDir = path.join(__dirname, '../tmp');
    const tmpFile = path.join(tmpDir, `${Date.now()}.${type.ext}`);
    const outFile = `${tmpFile}.webp`;
    await fs.promises.writeFile(tmpFile, (Buffer.from(media)));
    return new Promise((resolve, reject) => {
      const Fffmpeg = /video/i.test(type.mime) ? Fluent_Ffmpeg(tmpFile).inputFormat(type.ext) : Fluent_Ffmpeg(
        tmpFile);
      Fffmpeg.on('error', async (err) => {
        console.error('FFmpeg error:', err);
        await fs.promises.unlink(tmpFile);
        reject(err);
      }).on('end', async () => {
        await fs.promises.unlink(tmpFile);
        const data = await fs.promises.readFile(outFile);
        resolve(data);
        await fs.promises.unlink(outFile);
      }).addOutputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`,
        '-lossless', '0',
    '-compression_level', '6',
    '-qscale', '80',
    '-preset', 'default',
    '-t', '00:00:05'
    ]).toFormat('webp').save(outFile);
    });
  } catch (e) {
    console.error('Error in sticker6:', e);
    throw e;
  }
}
async function sticker7(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const type = await fileTypeFromBuffer(Buffer.from(media)) || {
      mime: 'video/mp4',
      ext: 'mp4'
    };
    if (!/image|video/.test(type.mime)) {
      throw new Error('Provided file is neither an image nor a video');
    }
    return await imageToWebp(Buffer.from(media));
  } catch (error) {
    console.error('Error in sticker7:', error);
    throw error;
  }
}
async function sticker8(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    return await sharp(Buffer.from(media)).webp({
      quality: 100,
      lossless: true
    }).toBuffer();
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error;
  }
}
async function sticker9(media, url, quality = 60) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const mux = new WebPMux();
    await mux.setImage(Buffer.from(media));
    return await mux.save();
  } catch (error) {
    throw new Error(`WebP conversion error: ${error.message}`);
  }
}
async function sticker10(media, url, packname, author, extra = {}) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }
    const metadata = {
      packname: extra.packname || "Taylor-V2",
      author: extra.author || "Wudysoft",
      isEmail: extra.isEmail || "wudysoft@mail.com",
      isWeb: extra.isWeb || "https://github.com/AyGemuy/Taylor-V2",
      androidLink: extra.androidLink || "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
      isFirst: extra.isFirst !== undefined ? extra.isFirst : 1,
      osLink: extra.osLink || "https://apps.apple.com/id/app/clash-of-clans/id529479190",
      isAvatar: extra.isAvatar !== undefined ? extra.isAvatar : 0
    };
    const options = {
      author: author || 'Test',
      pack: packname || 'Test_Pack',
      type: _StickerTypes.DEFAULT
    };
    return await toSticker(media, options, metadata);
  } catch (error) {
    console.error('Error in sticker10:', error);
    throw error;
  }
}
async function sticker11(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }

    const type = await fileTypeFromBuffer(Buffer.from(media)) || { ext: 'jpeg', mime: 'image/jpeg' };

    if (type.mime?.startsWith('video/')) {
      try {
        const ffmpegArgs = [
         '-q:v', '10',
          '-compression_level', '4'
        ];

        return await (await ffmpegConv((Buffer.from(media)), ffmpegArgs, type.ext, 'webp')).toBuffer();
      } catch (error) {
        console.error('Error in video processing:', error);
        throw error;
      }
    } else if (type.mime?.startsWith('image/')) {
      try {
        const ffmpegArgs = [
          '-q:v', '100',
          '-compression_level', '4'
        ];

        return await (await ffmpegConv((Buffer.from(media)), ffmpegArgs, type.ext, 'webp')).toBuffer();
      } catch (error) {
        console.error('Error in image processing:', error);
        throw error;
      }
    } else {
      throw new Error('Unsupported MIME type');
    }
  } catch (error) {
    console.error('Error in createSticker:', error);
    throw error;
  }
}
async function sticker12(media, url) {
  try {
    if (url) {
      const res = await fetch(url);
      if (res.status !== 200) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      media = await res.arrayBuffer();
    }

    const type = await fileTypeFromBuffer(Buffer.from(media)) || { ext: 'jpeg', mime: 'image/jpeg' };

    if (type.mime?.startsWith('video/')) {
      try {
        return  await mp42webp((Buffer.from(media)));
      } catch (error) {
        console.error('Error in video processing:', error);
        throw error;
      }
    } else if (type.mime?.startsWith('image/')) {
      try {
        return  await png2webp((Buffer.from(media)));
      } catch (error) {
        console.error('Error in image processing:', error);
        throw error;
      }
    } else {
      throw new Error('Unsupported MIME type');
    }
  } catch (error) {
    console.error('Error in createSticker:', error);
    throw error;
  }
}
/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  try {
    const metadata = {
      packname: packname || "Taylor-V2",
      author: author || "Wudysoft",
      isEmail: extra.isEmail || "wudysoft@mail.com",
      isWeb: extra.isWeb || "https://github.com/AyGemuy/Taylor-V2",
      androidLink: extra.androidLink || "https://play.google.com/store/apps/details?id=com.supercell.clashofclans",
      isFirst: extra.isFirst !== undefined ? extra.isFirst : 1,
      osLink: extra.osLink || "https://apps.apple.com/id/app/clash-of-clans/id529479190",
      isAvatar: extra.isAvatar !== undefined ? extra.isAvatar : 0
    };
    const cleanExtra = {
      ...extra
    };
    delete cleanExtra.isEmail;
    delete cleanExtra.isWeb;
    delete cleanExtra.androidLink;
    delete cleanExtra.isFirst;
    delete cleanExtra.osLink;
    delete cleanExtra.isAvatar;
    const stickerPackId = crypto.randomBytes(32).toString('hex');
    const json = {
      "sticker-pack-id": stickerPackId || "https://github.com/AyGemuy/Taylor-V2",
      "sticker-pack-name": metadata?.packname,
      "sticker-pack-publisher": metadata?.author,
      "sticker-pack-publisher-email": metadata?.isEmail,
      "sticker-pack-publisher-website": metadata?.isWeb,
      ...(categories && categories.length > 0 ? {
        emojis: categories
      } : {}),
      "android-app-store-link": metadata?.androidLink,
      "is-first-party-sticker": metadata?.isFirst,
      "ios-app-store-link": metadata?.osLink,
      "is-avatar-sticker": metadata?.isAvatar,
      ...cleanExtra
    };
    let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ]);
    let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    let exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer?.length, 14, 4);
    const media = new Image();
    await media.load(webpSticker);
    media.exif = exif;
    return await media.save(null);
  } catch (error) {
    console.error('Error in addExif:', error);
    throw error;
  }
}
async function video2webp(media) {
  const tmpFileOut = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  const tmpFileIn = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
  fs.writeFileSync(tmpFileIn, media)
  await new Promise((resolve, reject) => {
    Fluent_Ffmpeg(tmpFileIn).on("error", reject).on("end", () => resolve(true)).addOutputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`,
        '-loop', '0',
        '-ss', '00:00:00',
        '-t', '00:00:05',
        '-preset', 'default',
        '-an',
        '-vsync', '0'
    ]).toFormat("webp").save(tmpFileOut)
  })
  const buff = fs.readFileSync(tmpFileOut)
  fs.unlinkSync(tmpFileOut)
  fs.unlinkSync(tmpFileIn)
  return buff
}
async function video2webp30(media) {
  const tmpFileOut = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  const tmpFileIn = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
  fs.writeFileSync(tmpFileIn, media)
  await new Promise((resolve, reject) => {
    Fluent_Ffmpeg(tmpFileIn).on("error", reject).on("end", () => resolve(true)).addOutputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`,
        '-loop', '0',
        '-ss', '00:00:00',
        '-t', '00:00:05',
        '-preset', 'default',
        '-an',
        '-vsync', '0'
    ]).toFormat("webp").save(tmpFileOut)
  })
  const buff = fs.readFileSync(tmpFileOut)
  fs.unlinkSync(tmpFileOut)
  fs.unlinkSync(tmpFileIn)
  return buff
}
async function video2webp45(media) {
  const tmpFileOut = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  const tmpFileIn = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
  fs.writeFileSync(tmpFileIn, media)
  await new Promise((resolve, reject) => {
    Fluent_Ffmpeg(tmpFileIn).on("error", reject).on("end", () => resolve(true)).addOutputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`,
        '-loop', '0',
        '-ss', '00:00:00',
        '-t', '00:00:05',
        '-preset', 'default',
        '-an',
        '-vsync', '0'
    ]).toFormat("webp").save(tmpFileOut)
  })
  const buff = fs.readFileSync(tmpFileOut)
  fs.unlinkSync(tmpFileOut)
  fs.unlinkSync(tmpFileIn)
  return buff
}
async function video2webp60(media) {
  const tmpFileOut = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
  const tmpFileIn = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
  fs.writeFileSync(tmpFileIn, media)
  await new Promise((resolve, reject) => {
    Fluent_Ffmpeg(tmpFileIn).on("error", reject).on("end", () => resolve(true)).addOutputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse`,
        '-loop', '0',
        '-ss', '00:00:00',
        '-t', '00:00:05',
        '-preset', 'default',
        '-an',
        '-vsync', '0'
    ]).toFormat("webp").save(tmpFileOut)
  })
  const buff = fs.readFileSync(tmpFileOut)
  fs.unlinkSync(tmpFileOut)
  fs.unlinkSync(tmpFileIn)
  return buff
}
/**
 * Image/Video to Sticker
 * @param {Buffer} media Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {...String} 
 */
async function sticker(media, url, ...args) {
  let lastError, stiker;
  const functionsToTry = [
    global.support.ffmpeg && (global.support.convert || global.support.magick || global.support.gm) ? sticker2 :
    null,
    global.support.ffmpeg ? sticker6 : null,
    sticker10,
    sticker3,
    sticker11,
    sticker12,
    global.support.ffmpeg && global.support.ffmpegWebp ? sticker4 : null,
    sticker1,
    sticker7,
    sticker5,
    sticker9,
    sticker8
  ].filter(Boolean);
  for (let func of functionsToTry) {
    try {
      stiker = await func(media, url, ...args);
      if (stiker.includes('html')) continue;
      if (stiker.includes('WEBP')) {
        try {
          return await addExif(stiker, ...args);
        } catch (e) {
          console.error(e);
          return stiker;
        }
      }
      throw new Error(stiker.toString());
    } catch (err) {
      lastError = err;
    }
  }
  console.error(lastError);
  return lastError;
}
const support = {
  ffmpeg: true,
  ffprobe: true,
  ffmpegWebp: true,
  convert: true,
  magick: false,
  gm: false,
  find: false
};
export {
  sticker,
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  sticker6,
  sticker7,
  sticker8,
  sticker9,
  sticker10,
  sticker11,
  sticker12,
  video2webp,
  video2webp30,
  video2webp45,
  video2webp60,
  addExif,
  support
}
