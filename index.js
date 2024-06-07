import express from 'express';
import {
  fileURLToPath
} from 'url';
import {
  dirname,
  join,
  basename
} from 'path';
import {
  createRequire
} from 'module';
import {
  createInterface
} from 'readline';
import {
  setupMaster,
  fork
} from 'cluster';
import {
  watchFile,
  unwatchFile
} from 'fs';
import chalk from 'chalk';
import os from 'os';
import fs, {
  promises as fsPromises,
  readdirSync
} from 'fs';
import cfonts from 'cfonts';
import * as glob from 'glob';
import terminalImage from 'terminal-image';
console.log('🐾 Starting...');
const {
  say
} = cfonts;
const rl = createInterface(process.stdin, process.stdout);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const {
  name,
  author
} = require(join(__dirname, './package.json'));
say('Bot Whatsapp MD', {
  font: 'chrome',
  align: 'center',
  gradient: ['blue', 'green']
})
const taylorImage = fs.readFileSync(join(__dirname, 'thumbnail.jpg'));
let isRunning = false;
let server = null;
async function start(file) {
  const app = express();
  const port = process.env.PORT || process.env.SERVER_PORT || 3000;
  const htmlDir = join(__dirname, 'html');
  const sendHtml = (req, res, name) => res.sendFile(join(htmlDir, `${name}.html`));
  app.get('/', (req, res) => sendHtml(req, res, 'home'));
  app.get('/chat', (req, res) => sendHtml(req, res, 'chat'));
  app.get('/game', (req, res) => sendHtml(req, res, 'game'));
  app.get('/tools', (req, res) => sendHtml(req, res, 'tools'));
  app.get('/music', (req, res) => sendHtml(req, res, 'music'));
  server = app.listen(port, () => {
    console.log(chalk.green(`🌐 Port ${port} is open`));
  });
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Address localhost:${port} in use. Please retry when the port is available!`);
      server.close();
    } else {
      console.error('Server error:', error);
    }
  });
  if (isRunning) return;
  isRunning = true;
  const args = [join(__dirname, file), ...process.argv.slice(2)];
  say([process.argv[0], ...args].join(' '), {
    font: 'console',
    align: 'center',
    gradient: ['red', 'magenta']
  });
  setupMaster({
    exec: args[0],
    args: args.slice(1)
  });
  const p = fork();
  p.on('message', data => {
    console.log('[✅RECEIVED]', data);
    if (data === 'reset') {
      p.process.kill();
      isRunning = false;
      start(file);
    } else if (data === 'uptime') {
      p.send(process.uptime());
    }
  });
  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('[❗] Exited with code:', code);
    if (code !== 0) start(file);
    else {
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });
  const pluginsFolder = join(__dirname, 'plugins');
  try {
    const {
      fetchLatestBaileysVersion
    } = await import('@whiskeysockets/baileys');
    const {
      version
    } = await fetchLatestBaileysVersion();
    console.log(chalk.yellow(`🟡 Baileys library version ${version} is installed`));
  } catch (e) {
    console.error(chalk.red('❌ Baileys library is not installed'));
    shutdownServer();
  }
  console.log(chalk.yellow(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`));
  const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`💾 Total RAM: ${ramInGB.toFixed(2)} GB`));
  const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
  console.log(chalk.yellow(`💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`));
  console.log(chalk.yellow('📃 Script by wudysoft'));
  const packageJsonPath = join(__dirname, './package.json');
  try {
    const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
    const packageJsonObj = JSON.parse(packageJsonData);
    console.log(chalk.blue.bold(`\n📦 Package Information`));
    console.log(chalk.cyan(`Name: ${packageJsonObj.name}`));
    console.log(chalk.cyan(`Version: ${packageJsonObj.version}`));
    console.log(chalk.cyan(`Description: ${packageJsonObj.description}`));
    console.log(chalk.cyan(`Author: ${packageJsonObj.author.name}`));
  } catch (err) {
    console.error(chalk.red(`❌ Unable to read package.json: ${err}`));
    shutdownServer();
  }
  const foldersInfo = getFoldersInfo(pluginsFolder);
  console.log(chalk.blue.bold(`\n📂 Folders in "plugins" folder and Total Files`));
  const maxFolderWidth = 15;
  const maxTotalWidth = 10;
  foldersInfo.sort((a, b) => a.folder.localeCompare(b.folder));
  const tableData = foldersInfo.map(({
    folder,
    files
  }) => ({
    'Folder': folder.slice(0, maxFolderWidth).padEnd(maxFolderWidth),
    'Total Files': files.toString().slice(0, maxTotalWidth).padEnd(maxTotalWidth),
  }));
  const tableColumns = ['Folder', 'Total Files'];
  const styles = ['color: yellow; background-color: blue; border-radius: 10px;',
    'color: green; background-color: yellow; border-radius: 10px;',
  ];
  console.table(tableData, tableColumns, styles);
  console.log(chalk.blue.bold(`\n⏰ Current Time`));
  const currentTime = new Date().toLocaleString();
  console.log(chalk.cyan(`${currentTime}`));
  say('Taylor-V2', {
    font: 'chrome',
    align: 'center',
    gradient: ['blue', 'green']
  });
  console.log(await terminalImage.buffer(taylorImage, {
    width: 60
  }));
  say('Have fun, thanks for using this script.', {
    font: 'console',
    align: 'center',
    gradient: ['blue', 'green']
  });
  setInterval(() => {}, 1000);
}

function getFoldersInfo(folderPath) {
  const folders = glob.sync(join(folderPath, '*/'));
  const foldersInfo = folders.map((folder) => ({
    folder: basename(folder),
    files: getTotalFilesInFolder(folder),
  }));
  return foldersInfo;
}

function getTotalFilesInFolder(folderPath) {
  const files = readdirSync(folderPath);
  return files.length;
}

function shutdownServer() {
  console.error(chalk.red('❌ Shutting down the server due to an error.'));
  server.close(() => {
    console.log(chalk.red('🛑 Server has been shut down.'));
    process.exit(1);
  });
}
start('main.js');
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
  console.log('\x1b[33m%s\x1b[0m', `📁 Created directory ${tmpDir}`);
}
