import {
  spawn
} from 'child_process';
import {
  join
} from 'path';
const __dirname = global.__dirname(import.meta.url);
/**
 * Levelup image
 * @param {String} teks 
 * @param {Number} level 
 * @returns {Promise<Buffer>}
 */
export function levelup(teks, level) {
  return new Promise(async (resolve, reject) => {
    if (!(global.support.convert || global.support.magick || global.support.gm)) {
      return reject('Not Support!');
    }
    const font = join(__dirname, '../src/font');
    const fontLevel = join(font, './level_c.otf');
    const fontTexts = join(font, './texts.otf');
    const xtsx = join(__dirname, '../src/lvlup_template.jpg');
    const anotations = level > 100 ? '+1260+260' : level > 50 ? '+1310+260' : level > 10 ? '+1330+260' : level >
      2 ? '+1370+260' : '+1385+260';
    const [_spawnprocess, ..._spawnargs] = [...(global.support.gm ? ['gm'] : global.support.magick ? [
        'magick'] : []), 'convert',
      xtsx, '-font', fontTexts, '-fill', '#0F3E6A', '-size', '1024x784', '-pointsize', '68', '-interline-spacing',
      '-7.5', '-annotate', '+153+200', teks, '-font', fontLevel, '-fill', '#0A2A48', '-size', '1024x784',
      '-pointsize', '140', '-interline-spacing', '-1.2', '-annotate', anotations, level, '-append', 'jpg:-'
    ];
    try {
      let bufs = [];
      const process = spawn(_spawnprocess, _spawnargs);
      process.stdout.on('data', chunk => bufs.push(chunk));
      process.on('close', () => resolve(Buffer.concat(bufs)));
      process.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}
