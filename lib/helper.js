import yargs from 'yargs';
import os from 'os';
import path, {
  dirname
} from 'path';
import {
  fileURLToPath,
  pathToFileURL
} from 'url';
import {
  createRequire
} from 'module';
import fs from 'fs';
import {
  Readable
} from 'stream';
import emojiRegex from 'emoji-regex';
const __filename = (pathURL = import.meta, rmPrefix = os.platform() !== 'win32') => {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL)
.toString();
};
const __dirname = (pathURL) => {
  return path.dirname(__filename(pathURL, true));
};
const __require = (dir = import.meta) => {
  return createRequire(dir);
};
const checkFileExists = async (file) => {
  try {
    await fs.promises.access(file, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};
const checkFilesExist = async (files) => {
  if (!Array.isArray(files)) {
    return await checkFileExists(files);
  } else {
    const fileChecks = files.map(file => checkFileExists(file));
    const results = await Promise.all(fileChecks);
    return results;
  }
};
const API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path +
  (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query,
    ...(apikeyqueryname ? {
      [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]
    } : {})
  })) : '');
const saveStreamToFile = async (stream, file) => {
  const writable = fs.createWriteStream(file);
  await new Promise((resolve, reject) => {
    writable.on('finish', resolve);
    writable.on('error', reject);
    stream.pipe(writable);
  });
};
const isReadableStream = (stream) => {
  return (typeof stream === 'object' && stream !== null && (
    (stream instanceof Readable && typeof stream.pipe === 'function') || stream instanceof fs.ReadStream || (
      typeof stream.pipe === 'function' && typeof stream.on === 'function')));
};
const symbolRegex = /^[^\w\s\d]/u;
const emojiAndSymbolRegex = new RegExp(`(${symbolRegex.source}|${emojiRegex().source})`, 'u');
const prefix = emojiAndSymbolRegex;
const opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
export default {
  __filename,
  __dirname,
  __require,
  checkFileExists,
  checkFilesExist,
  API,
  saveStreamToFile,
  isReadableStream,
  opts,
  prefix,
};
