import os from 'os';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.NODE_ENV = 'production';
process.env.V8_ENABLE_WEBASSEMBLY = '1';
process.env.V8_CONTEXT_ALIGNMENT = '64';
process.env.V8_DEPRECATION_WARNINGS = 'false';
process.env.V8_TURBOFAN_BACKEND = '1';
process.env.V8_TURBOFAN_INTRINSICS = '1';

const totalMemMB = Math.floor(os.totalmem() / (1024 * 1024));
process.env.UV_THREADPOOL_SIZE = totalMemMB <= 1024 ? '4' : totalMemMB <= 2048 ? '8' : (os.cpus().length * 2).toString();

import {
    loadConfig
} from './config.js';

import Helper from './lib/helper.js';

import {
    createRequire
} from "module";
import path from 'path';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import {
    platform
} from 'process';

import * as glob from 'glob';

import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    rmSync,
    watch,
    createWriteStream
} from 'fs';
import fs from 'fs/promises';
import yargs from 'yargs';
import {
    spawn
} from 'child_process';
import lodash from 'lodash';
import ora from 'ora';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import chokidar from 'chokidar';
import {
    format,
    promisify,
    isDeepStrictEqual
} from 'util';
import colors from 'colors';
import {
    Boom
} from "@hapi/boom";
import pino from 'pino';
import pretty from 'pino-pretty';
import fetch from 'node-fetch';
const stream = pretty({
    colorize: true,
    levelFirst: false,
    messageKey: 'msg',
    timestampKey: 'time',
    translateTime: 'dd-mmmm-yyyy hh:MM TT',
    ignore: 'pid,hostname',
    customColors: 'info:bgBlueBright,error:bgRedBright,fatal:bgRedBright,warn:bgYellowBright,debug:bgGreenBright,trace:bgCyanBright',
    messageFormat: '{msg}\n⤵️\n',
    customPrettifiers: {
        payload: (value) => format(value, {
            depth: null,
            breakLength: 4,
            colors: true
        }),
    },
});

import {
    makeWASocket,
    protoType,
    serialize
} from './lib/simple.js';
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';
import {
    cloudDBAdapter
} from './lib/cloudDBAdapter.js';

const {
    fetchLatestWaWebVersion,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    proto,
    PHONENUMBER_MCC,
    delay,
    DisconnectReason
} = (await import('@whiskeysockets/baileys')).default;

import inquirer from 'inquirer';
import parsePhoneNumber from 'awesome-phonenumber';

import single2multi from './lib/single2multi.js';
import storeSystem from './lib/store-multi.js';

import {
    parentPort,
    isMainThread,
    Worker
} from 'worker_threads';
import {
    writeHeapSnapshot
} from 'v8';

const heapdumpOptions = {
    dirname: 'tmp',
    prefix: 'heapdump_'
};

if (isMainThread) {
    const tmpDir = path.join(process.cwd(), heapdumpOptions.dirname);
    const worker = new Worker(path.join(process.cwd(), 'main.js'));
    const heapdumpPromises = [];

    worker.postMessage({
        message: 'heapdump',
        options: heapdumpOptions
    });

    worker.on('message', filename => heapdumpPromises.push(filename));
    worker.on('exit', () => Promise.all(heapdumpPromises).then(heapdumpFiles => console.log('Heapdump files:', heapdumpFiles)).catch(error => console.error('Error generating heapdump:', error)));
    worker.on('error', error => console.error('Worker error:', error));
} else {
    parentPort.once('message', async ({
        message,
        options
    }) => {
        if (message === 'heapdump') {
            try {
                const filename = await generateHeapDump(options);
                parentPort.postMessage(filename);
            } catch (error) {
                console.error('Error generating heapdump:', error);
            }
        }
    });

    parentPort.once('error', error => console.error('Parent port error:', error));
}

async function generateHeapDump(options) {
    const {
        dirname,
        prefix
    } = options;
    const filename = path.join(dirname, `${prefix}${Date.now()}.heapsnapshot`);
    await writeHeapSnapshot(filename);
    return filename;
}

const pairingCode = Helper.opts["pairing-code"]
const useMobile = Helper.opts["mobile"]
const useQr = Helper.opts["qr"]
const singleToMulti = Helper.opts["singleauth"]

const askQuestion = async (text) => {
    console.clear();
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'input',
        message: text,
        prefix: '📱',
        validate: value => {
            if (!/^\+?\d+$/.test(value)) console.clear();
            return /^\+?\d+$/.test(value) || 'Format nomor ponsel tidak valid. Masukkan nomor ponsel sesuai format internasional.\n(format internasional, contoh: +1234567890 atau 1234567890)';
        },
        onClose: () => console.log(chalk.yellow('Prompt ditutup.'))
    });

    const result = answer.input;
    console.log(chalk.bgGreen.black('\n🎉 Berhasil untuk nomor:'), chalk.yellow(result));
    return result;
};


import NodeCache from "node-cache"
const msgRetryCounterCache = new NodeCache()

const {
    chain
} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType();
serialize();
await loadConfig();

global.API = Helper.API
Object.assign(global, {
    ...Helper,
    timestamp: {
        start: Date.now()
    }
});
const directoryName = Helper.__dirname(import.meta.url)
global.opts = new Object(Helper.opts)

global.prefix = Helper.prefix;
const dbUrl = opts.db || opts.dbv2 || '';
const dbName = opts._[0] ? `${opts._[0]}_database.json` : 'database.json';

const dbInstance = !dbUrl ?
    new JSONFile(dbName) :
    /^https?:\/\//.test(dbUrl) ?
    new cloudDBAdapter(dbUrl) :
    /^mongodb(\+srv)?:\/\//i.test(dbUrl) && opts.db ?
    new mongoDB(dbUrl) :
    /^mongodb(\+srv)?:\/\//i.test(dbUrl) && opts.dbv2 ?
    new mongoDBV2(dbUrl) :
    new JSONFile(dbName);

global.db = new Low(dbInstance);
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
    const db = global.db;
    return db.READ ?
        new Promise((resolve) => {
            const intervalId = setInterval(async () => {
                if (!db.READ) {
                    clearInterval(intervalId);
                    resolve(db.data == null ? await global.loadDatabase() : db.data);
                }
            }, 1 * 1000);
        }) :
        db.data === null ?
        (db.READ = true,
            await db.read().catch(console.error),
            (db.READ = null),
            (db.data = {
                users: {},
                chats: {},
                stats: {},
                msgs: {},
                sticker: {},
                settings: {},
                ...(db.data || {}),
            }),
            (db.chain = chain(db.data)),
            null) :
        null;
}
await loadDatabase();

const {
    version,
    isLatest
} = await fetchLatestBaileysVersion().catch(() => fetchLatestWaWebVersion());

global.authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}TaylorSession`)
global.authFile = `${Helper.opts._[0] || 'session'}.data.json`

const [
    isCredsExist,
    isAuthSingleFileExist,
    authState
] = await Promise.all([
    Helper.checkFilesExist(authFolder + '/creds.json'),
    Helper.checkFilesExist(authFile),
    storeSystem.useMultiFileAuthState(authFolder)
])

const logger = pino({
    level: 'info'
}, stream);

process
    .on('unhandledRejection', (err, promise) => logger.error({
        err,
        promise
    }, 'Unhandled Rejection'))
    .on('rejectionHandled', (promise) => logger.info({
        promise
    }, 'Rejection Handled'))
    .on('uncaughtException', (err, origin) => logger.error({
        err,
        origin
    }, 'Uncaught Exception'))
    .on('unhandledPromiseRejection', (reason, promise) => logger.error({
        reason,
        promise
    }, 'Unhandled Promise Rejection'))
    .on('SIGTERM', () => logger.info('Received SIGTERM signal'))
    .on('SIGINT', () => logger.info('Received SIGINT signal'))
    .on('SIGUSR1', () => logger.info('Received SIGUSR1 signal'))
    .on('SIGUSR2', () => logger.info('Received SIGUSR2 signal'))
    .on('beforeExit', (code) => logger.warn({
        code
    }, 'Process Before Exit'))
    .on('exit', (code) => logger.info({
        code
    }, 'Process Exit'))
    .on('warning', (warning) => null)
    .on('disconnect', () => logger.warn('Node Disconnected'))
    .on('message', (message) => logger.info({
        message
    }, 'Node Message'))
    .on('multipleResolves', (type, promise) => null)
    .on('childProcess', (childProcess) => logger.info({
        childProcess
    }, 'Child Process Event'));

global.store = storeSystem.makeInMemoryStore({
    logger
});

if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
    if (!isCredsExist && isAuthSingleFileExist) {
        console.debug(chalk.bold.blue('- singleauth -'), chalk.bold.yellow('creds.json not found'), chalk.bold.green('compiling singleauth to multiauth...'));
        await single2multi(authFile, authFolder, authState);
        console.debug(chalk.bold.blue('- singleauth -'), chalk.bold.green('compiled successfully'));
        authState = await storeSystem.useMultiFileAuthState(authFolder);
    } else if (!isAuthSingleFileExist) console.error(chalk.bold.blue('- singleauth -'), chalk.bold.red('singleauth file not found'));
}

const storeFile = `${Helper.opts._[0] || 'data'}.store.json`
store.readFromFile(storeFile)

const connectionOptions = {
    ...(!pairingCode && !useMobile && !useQr && {
        printQRInTerminal: false,
        mobile: !useMobile
    }),
    ...(pairingCode && {
        printQRInTerminal: !pairingCode
    }),
    ...(useMobile && {
        mobile: !useMobile
    }),
    ...(useQr && {
        printQRInTerminal: true
    }),
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(message.buttonsMessage || message.templateMessage || message.listMessage);
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {}
                        },
                        ...message
                    }
                }
            };
        }
        return message;
    },
    msgRetryCounterMap: {},
    logger,
    auth: {
        creds: authState.state.creds,
        keys: makeCacheableSignalKeyStore(authState.state.keys, logger),
    },
    browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
    version,
    getMessage: async (key) => {
        if (store) {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        }
        return proto.Message.fromObject({});
    },
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false
};

global.conn = makeWASocket(connectionOptions);
store.bind(conn.ev)
conn.isInit = false

if (pairingCode && !conn.authState.creds.registered) {
    if (useMobile) {
        console.log('\nCannot use pairing code with mobile api');
    }
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(chalk.redBright(`📨 ${'Please type your WhatsApp number'}:`));
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    let phoneNumber = await askQuestion(`   ${chalk.bold.cyan('- Number')}: `);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
        console.log(chalk.redBright(`💬 ${"Start with your country's WhatsApp code, Example 62xxx"}:`));
        console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(chalk.redBright(`📨 ${'Please type your WhatsApp number'}:`));
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        phoneNumber = await askQuestion(`   ${chalk.bold.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    }
    await delay(3000);
    let code = await conn.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.cyan('╭──────────────────────────────────────···'));
    console.log(` 💻 ${chalk.redBright('Your Pairing Code')}:`);
    console.log(chalk.cyan('├──────────────────────────────────────···'));
    console.log(`   ${chalk.bold.cyan('- Code')}: ${code}`);
    console.log(chalk.cyan('╰──────────────────────────────────────···'));
}

if (useMobile && !conn.authState.creds.registered) {
    const {
        registration
    } = conn.authState.creds || {
        registration: {}
    };
    if (!registration.phoneNumber) {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(chalk.redBright(`📨 ${'Please type your WhatsApp number'}:`));
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let phoneNumber = await askQuestion(`   ${chalk.bold.cyan('- Number')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(chalk.redBright(`💬 ${"Start with your country's WhatsApp code, Example 62xxx"}:`));
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(chalk.redBright(`📨 ${'Please type your WhatsApp number'}:`));
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            phoneNumber = await askQuestion(`   ${chalk.bold.cyan('- Number')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        }
        registration.phoneNumber = "+" + phoneNumber;
    }

    const phoneNumber = parsePhoneNumber(registration.phoneNumber);
    if (!phoneNumber.isValid()) {
        console.log('\nInvalid phone number: ' + registration.phoneNumber);
    }
    registration.phoneNumber = phoneNumber.format("E.164");
    registration.phoneNumberCountryCode = phoneNumber.countryCallingCode;
    registration.phoneNumberNationalNumber = phoneNumber.nationalNumber;
    const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode];
    registration.phoneNumberMobileCountryCode = mcc;

    async function enterCode() {
        try {
            console.log(chalk.cyan('╭──────────────────────────────────────···'));
            console.log(`📨 ${chalk.redBright('Please Enter Your OTP Code')}:`);
            console.log(chalk.cyan('├──────────────────────────────────────···'));
            const code = await askQuestion(`   ${chalk.bold.cyan('- Code')}: `);
            console.log(chalk.cyan('╰──────────────────────────────────────···'));
            const response = await conn.register(code.replace(/[^0-9]/g, '').trim().toLowerCase());
            console.log(chalk.cyan('╭─────────────────────────────────────────────────···'));
            console.log(`💬 ${chalk.redBright("Successfully registered your phone number.")}`);
            console.log(chalk.cyan('╰─────────────────────────────────────────────────···'));
            console.log(response);
        } catch (error) {
            console.error('\nFailed to register your phone number. Please try again.\n', error);
            await enterCode();
        }
    }

    async function askOTP() {
        console.log(chalk.cyan('╭──────────────────────────────────────···'));
        console.log(`📨 ${chalk.redBright('What method do you want to use? "sms" or "voice"')}:`);
        console.log(chalk.cyan('├──────────────────────────────────────···'));
        let code = await askQuestion(`   ${chalk.bold.cyan('- Method')}: `);
        console.log(chalk.cyan('╰──────────────────────────────────────···'));
        code = code.replace(/["']/g, '').trim().toLowerCase();
        if (code !== 'sms' && code !== 'voice') return await askOTP();
        registration.method = code;
        try {
            await conn.requestRegistrationCode(registration);
            await enterCode();
        } catch (error) {
            console.error('\nFailed to request registration code. Please try again.\n', error);
            await askOTP();
        }
    }

    await askOTP();
}

logger.info('\n🚩 W A I T I N G\n');

async function writeDatabase() {
    try {
        await Promise.allSettled([
            global.db.data ? global.db.write(global.db.data) : Promise.reject('global.db.data is null')
        ]);
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(writeDatabase, 30 * 60000);
    }
};


if (opts['server']) {
    (await import('./server.js')).default(global.conn, PORT);
}

let timeout = 0;
async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect,
        isNewLogin,
        qr,
        isOnline,
        receivedPendingNotifications
    } = update;

    if (connection) console.info("Taylor-V2".main, ">>".yellow, `Connection Status : ${connection}`.info);

    if (isNewLogin) conn.isInit = true;

    const code = (lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode);

    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        try {
            await global.reloadHandler(true);
        } catch (err) {
            console.error(err);
        }
    }

    if (!global.db.data) await loadDatabase();

    if (connection === 'connecting') {
        timeout++;
        console.log(chalk.bold.redBright('⚡ Mengaktifkan Bot, Mohon tunggu sebentar...'));
        if (timeout > 30) {
            console.log("Taylor-V2".main, ">>".yellow, `Session logout after 30 times reconnecting, This action will save your number from banned!`.warn);
            setImmediate(() => process.exit(1));
        }
    }

    if (connection === 'open') {
        try {
            const {
                jid
            } = conn.user;
            const name = await conn.getName(jid);
            conn.user.name = name || 'Taylor-V2';

            const currentTime = new Date();
            const pingSpeed = new Date() - currentTime;
            const formattedPingSpeed = pingSpeed < 0 ? 'N/A' : `${pingSpeed}ms`;

            console.log("Taylor-V2".main, ">>".yellow, `Client connected on: ${conn?.user?.id.split(":")[0] || global.namebot}`.info);
            const infoMsg = `🤖 *Bot Info* 🤖\n🕰️ *Current Time:* ${currentTime}\n👤 *Name:* *${name || 'Taylor'}*\n🏷️ *Tag:* *@${jid.split('@')[0]}*\n⚡ *Ping Speed:* *${formattedPingSpeed}*\n📅 *Date:* ${currentTime.toDateString()}\n🕒 *Time:* ${currentTime.toLocaleTimeString()}\n📆 *Day:* ${currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}\n📝 *Description:* Bot *${name || 'Taylor'}* is now active.`;

            const messg = await conn.sendMessage(`${nomorown}@s.whatsapp.net`, {
                text: infoMsg,
                mentions: [nomorown + '@s.whatsapp.net', jid]
            }, {
                quoted: null
            });
            if (!messg) logger.error(`\nError Connection'\n${format(e)}'`);
        } catch (e) {
            logger.error(`\nError Connection'\n${format(e)}'`);
        }
        logger.info(chalk.bold.yellow('\n🚩 R E A D Y'));
        await runTasks();
        Object.freeze(global.reload);
    }

    if (isOnline === true) logger.info(chalk.bold.green('Status Aktif'));
    else if (isOnline === false) logger.error(chalk.bold.red('Status Mati'));

    if (receivedPendingNotifications) logger.warn(chalk.bold.yellow('Menunggu Pesan Baru'));

    if ((!pairingCode && !useMobile || useQr) && qr !== 0 && qr !== undefined && connection === 'close') {
        if (!useMobile) logger.error(chalk.bold.yellow(`\n🚩 Koneksi ditutup, harap hapus folder ${authFolder} dan pindai ulang kode QR`));
        else logger.info(chalk.bold.yellow(`\n🚩 Pindai kode QR ini, kode QR akan kedaluwarsa dalam 60 detik.`));
        setImmediate(() => process.exit(1));
    }
}

let isInit = true;
let handler = (await import('./handler.js'));
global.reloadHandler = async function reloadHandler(restatConn) {
    try {
        const Handler = (await import(`./handler.js?update=${Date.now()}`)).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (error) {
        console.error;
    }
    if (restatConn) {
        const oldChats = global.conn.chats;
        try {
            global.conn.ws.close();
        } catch (e) {
            console.error(e)
        }
        conn.ev.removeAllListeners();
        global.conn = makeWASocket(connectionOptions, {
            chats: oldChats
        });
        isInit = true;
    }
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('messages.update', conn.pollUpdate);
        conn.ev.off('group-participants.update', conn.participantsUpdate);
        conn.ev.off('groups.update', conn.groupsUpdate);
        conn.ev.off('message.delete', conn.onDelete);
        conn.ev.off('presence.update', conn.presenceUpdate);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
    }

    const emoji = {
        welcome: '👋',
        bye: '👋',
        promote: '👤👑',
        demote: '👤🙅‍♂️',
        desc: '📝',
        subject: '📌',
        icon: '🖼️',
        revoke: '🔗',
        announceOn: '🔒',
        announceOff: '🔓',
        restrictOn: '🚫',
        restrictOff: '✅',
    };

    conn.welcome = `${emoji.welcome} Hallo @user\n\n   *W E L C O M E*\n⫹⫺ Di grup @subject\n\n⫹⫺ Baca *DESKRIPSI*\n@desc`;
    conn.bye = `   *G O O D B Y E*\n${emoji.bye} Sampai jumpa @user`;
    conn.spromote = `*${emoji.promote} @user* sekarang menjadi admin!`;
    conn.sdemote = `*${emoji.demote} @user* tidak lagi menjadi admin!`;
    conn.sDesc = `${emoji.desc} Deskripsi telah diubah menjadi:\n@desc`;
    conn.sSubject = `${emoji.subject} Judul grup telah diubah menjadi:\n@subject`;
    conn.sIcon = `${emoji.icon} Icon grup telah diubah!`;
    conn.sRevoke = `${emoji.revoke} Link grup telah diubah ke:\n@revoke`;
    conn.sAnnounceOn = `${emoji.announceOn} Grup telah ditutup!\nSekarang hanya admin yang dapat mengirim pesan.`;
    conn.sAnnounceOff = `${emoji.announceOff} Grup telah dibuka!\nSekarang semua peserta dapat mengirim pesan.`;
    conn.sRestrictOn = `${emoji.restrictOn} Edit Info Grup diubah ke hanya admin!`;
    conn.sRestrictOff = `${emoji.restrictOff} Edit Info Grup diubah ke semua peserta!`;

    conn.handler = handler.handler.bind(global.conn);
    conn.pollUpdate = handler.pollUpdate.bind(global.conn);
    conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
    conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
    conn.onDelete = handler.deleteUpdate.bind(global.conn);
    conn.presenceUpdate = handler.presenceUpdate.bind(global.conn);
    conn.connectionUpdate = connectionUpdate.bind(global.conn);
    conn.credsUpdate = authState.saveCreds.bind(global.conn, true);

    const currentDateTime = new Date();
    const messageDateTime = new Date(conn.ev);
    if (currentDateTime >= messageDateTime) {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    } else {
        const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
    }

    conn.ev.on('messages.upsert', conn.handler);
    conn.ev.on('messages.update', conn.pollUpdate);
    conn.ev.on('group-participants.update', conn.participantsUpdate);
    conn.ev.on('groups.update', conn.groupsUpdate);
    conn.ev.on('message.delete', conn.onDelete);
    conn.ev.on('presence.update', conn.presenceUpdate);
    conn.ev.on('connection.update', conn.connectionUpdate);
    conn.ev.on('creds.update', conn.credsUpdate);

    isInit = false;
    return true;
};
await global.reloadHandler();

const spinner = ora({
    text: 'Running tasks',
    spinner: 'moon'
});
const runTasks = async () => {
    const tasks = [{
            func: _quickTest,
            message: 'Quick Test',
            style: chalk.bgBlue.bold
        },
        {
            func: writeDatabase,
            message: 'Write database',
            style: chalk.bgBlue.bold
        },
        {
            func: filesInit,
            message: 'Initializing files',
            style: chalk.bgBlue.bold
        },
        {
            func: libFiles,
            message: 'Loading library files',
            style: chalk.bgBlue.bold
        },
        {
            func: watchFiles,
            message: 'Watching files',
            style: chalk.bgBlue.bold
        },
        {
            func: () => watch(path.resolve(directoryName, 'plugins'), global.reload),
            message: 'Watching plugins',
            style: chalk.bgBlue.bold
        },
        {
            func: clearTmp,
            message: 'Clearing temporary files',
            style: chalk.bgBlue.bold
        },
        {
            func: clearSessions,
            message: 'Clearing sessions',
            style: chalk.bgBlue.bold
        },
        {
            func: createCertificate,
            message: 'Create Certs',
            style: chalk.bgBlue.bold
        },
    ].filter(task => task !== null);

    const executeTask = async ({
        func,
        message,
        style
    }) => {
        try {
            spinner.start();
            spinner.text = style(message);
            await func();
            spinner.succeed(message);
            return {
                status: 'fulfilled',
                message
            };
        } catch (error) {
            spinner.fail(`Error occurred while running ${message}.`);
            console.error(`Error occurred while running ${message}:`, error);
            return {
                status: 'rejected',
                message,
                error
            };
        }
    };

    try {
        const results = await Promise.allSettled(tasks.map(executeTask));
        results.forEach(result => {
            if (result.status === 'fulfilled') console.log(`${result.value.message} completed successfully!`);
        });
        console.log('All tasks completed.');
    } catch (error) {
        console.error('Error occurred while running tasks:', error);
    } finally {
        spinner.stop();
    }
};

const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
    const CommandsFiles = glob.sync(path.resolve(path.resolve(directoryName, 'plugins'), '**/*.js'), {
        ignore: ['**/node_modules/**', '**/run.js']
    });

    const importPromises = CommandsFiles.map(async (file) => {
        const moduleName = path.join('/plugins', path.relative(path.resolve(directoryName, 'plugins'), file));

        try {
            const fileContent = await readFileSync(file, 'utf-8');
            const err = syntaxerror(fileContent, file, {
                sourceType: 'module',
                ecmaVersion: 2020,
                allowAwaitOutsideFunction: true,
                allowReturnOutsideFunction: true,
                allowImportExportEverywhere: true
            });
            if (err) {
                delete global.plugins[moduleName];
                return {
                    moduleName,
                    filePath: file,
                    message: err.message,
                    error: err.message,
                    success: false
                };
            } else {
                const module = (await import(file));
                global.plugins[moduleName] = module.default || module;
                return {
                    moduleName,
                    filePath: file,
                    success: true
                };
            }
        } catch (e) {
            logger.error(e);
            delete global.plugins[moduleName];
            return {
                moduleName,
                filePath: file,
                message: e.message,
                error: e,
                success: false
            };
        }
    });

    try {
        const results = await Promise.allSettled(importPromises);
        const successResults = results.filter((result) => result.status === 'fulfilled').map((result) => result.value.moduleName);
        const errorResults = results.filter((result) => result.status === 'rejected').map((result) => ({
            filePath: result.reason.filePath,
            error: result.reason.error
        }));

        global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );

        const loadedPluginsMsg = `Loaded ${CommandsFiles.length} JS Files total.`;
        const successPluginsMsg = `✅ Success Plugins:\n${successResults.length} total.`;
        const errorPluginsMsg = `❌ Error Plugins:\n${errorResults.length} total`;

        logger.warn(loadedPluginsMsg);
        logger.info(successPluginsMsg);
        logger.error(errorPluginsMsg);

        const errorMessagesText = errorResults
            .map((error, index) => `❗ *Error ${index + 1}:* ${error.filePath}\n - ${error.error.message}`)
            .join('\n');

        const messageText = `- 🤖 *Loaded Plugins Report* 🤖\n` +
            `🔧 *Total Plugins:* ${CommandsFiles.length}\n` +
            `✅ *Success:* ${successResults.length}\n` +
            `❌ *Error:* ${errorResults.length}\n` +
            (errorResults.length > 0 ? errorMessagesText : '');

        const messg = await conn.sendMessage(`${nomorown}@s.whatsapp.net`, {
            text: messageText
        }, {
            quoted: null
        });

        if (!messg) logger.error(`\nError sending message`);
    } catch (e) {
        logger.error(`\nError sending message: ${e}`);
    }
}

global.lib = {};

async function libFiles() {
    const CommandsFiles = glob.sync(path.resolve(path.resolve(Helper.__dirname(import.meta.url), 'lib'), '**/*.js'), {
        ignore: ['**/node_modules/**', '**/run.js']
    });

    const importPromises = CommandsFiles.map(async (file) => {
        const moduleName = path.join('/lib', path.relative(path.resolve(Helper.__dirname(import.meta.url), 'lib'), file));

        try {
            const fileContent = await readFileSync(file, 'utf-8');
            const err = syntaxerror(fileContent, file, {
                sourceType: 'module',
                ecmaVersion: 2020,
                allowAwaitOutsideFunction: true,
                allowReturnOutsideFunction: true,
                allowImportExportEverywhere: true
            });
            if (err) {
                delete global.lib[moduleName.slice(0, -3)];
                return {
                    moduleName,
                    filePath: file,
                    error: err.message,
                    success: false
                };
            } else {
                const module = (await import(file)).default || (await import(file));
                setNestedObject(global.lib, moduleName.slice(0, -3), module);
                return {
                    moduleName,
                    filePath: file,
                    success: true
                };
            }
        } catch (e) {
            logger.error(e);
            delete global.lib[moduleName.slice(0, -3)];
            return {
                moduleName,
                filePath: file,
                error: e,
                success: false
            };
        }
    });

    try {
        const results = await Promise.allSettled(importPromises);
        const successResults = results.filter((result) => result.status === 'fulfilled').map((result) => result.value.moduleName);
        const errorResults = results.filter((result) => result.status === 'rejected').map((result) => ({
            filePath: result.reason.filePath,
            error: result.reason.error
        }));

        global.lib = Object.fromEntries(Object.entries(global.lib[''].lib).sort(([a], [b]) => a.localeCompare(b)));

        const loadedPluginsMsg = `Loaded ${CommandsFiles.length} JS Files total.`;
        const successPluginsMsg = `✅ Success Lib:\n${successResults.length} total.`;
        const errorPluginsMsg = `❌ Error Lib:\n${errorResults.length} total`;

        logger.warn(loadedPluginsMsg);
        logger.info(successPluginsMsg);
        logger.error(errorPluginsMsg);
        
        const errorMessagesText = errorResults
            .map((error, index) => `❗ *Error ${index + 1}:* ${error.filePath}\n - ${error.error.message}`)
            .join('\n');

        const messageText = `- 🤖 *Loaded Plugins Report* 🤖\n` +
            `🔧 *Total Plugins:* ${CommandsFiles.length}\n` +
            `✅ *Success:* ${successResults.length}\n` +
            `❌ *Error:* ${errorResults.length}\n` +
            (errorResults.length > 0 ? errorMessagesText : '');
            
        logger.info(messageText);
    } catch (e) {
        logger.error(`Error occurred while importing libraries: ${e}`);
    }
}

const setNestedObject = (obj, path, value) =>
    path.split('/').reduce((acc, key, index, keys) => (index === keys.length - 1 ? (acc[key] = value) : (acc[key] = acc[key] || {})), obj);

global.reload = async (_ev, filename) => {
    if (!pluginFilter(filename)) return;

    const dir = path.join(path.resolve(directoryName, 'plugins'), filename);

    try {
        if (existsSync(dir)) {
            logger.info(`\nRequiring plugin '${filename}'`);
            const fileContent = await readFileSync(dir, 'utf-8');
            const err = syntaxerror(fileContent, filename, {
                sourceType: 'module',
                ecmaVersion: 2020,
                allowAwaitOutsideFunction: true,
                allowReturnOutsideFunction: true,
                allowImportExportEverywhere: true
            });
            if (err) {
                logger.error(`\nSyntax error while loading '${filename}'\n${format(err)}`);
            } else {
                const module = (await import(`${Helper.__filename(dir)}?update=${Date.now()}`));
                global.plugins[filename] = module.default || module;
            }
        } else {
            logger.warn(`Deleted plugin '${filename}'`);
            delete global.plugins[filename];
        }
    } catch (e) {
        logger.error(`\nError requiring plugin '${filename}'\n${format(e)}`);
    } finally {
        global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );
    }
};

async function FileEv(type, file) {
    try {
        const resolvedFile = path.resolve(Helper.__filename(file));
        switch (type) {
            case 'delete':
                delete global.plugins[resolvedFile];
                break;
            case 'change':
            case 'add':
                const module = (await import(`${resolvedFile}?update=${Date.now()}`));
                global.plugins[resolvedFile] = module.default || module;
                break;
        }
    } catch (e) {
        logger.error(`\nError processing file event '${type}' for '${file}': ${e.message}`);
    } finally {
        global.plugins = Object.fromEntries(
            Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        );
    }
}

async function watchFiles() {
    const watcher = chokidar.watch(['./plugins/**/*.js', '!./node_modules/**/*.js', '!./run.js'], {
        ignored: /(^|[/\\])\../,
        ignoreInitial: true,
        persistent: true,
        usePolling: true,
        cwd: directoryName
    });

    watcher
        .on('add', async (path) => {
            try {
                logger.info(`\nNew plugin - '${path}'`);
                await FileEv('add', `./${path}`);
            } catch (e) {
                logger.error(`\nError handling 'add' event for '${path}': ${e.message}`);
            }
        })
        .on('change', async (path) => {
            try {
                logger.info(`\nUpdated plugin - '${path}'`);
                await FileEv('change', `./${path}`);
            } catch (e) {
                logger.error(`\nError handling 'change' event for '${path}': ${e.message}`);
            }
        })
        .on('unlink', async (path) => {
            try {
                logger.warn(`Deleted plugin - '${path}'`);
                await FileEv('delete', `./${path}`);
            } catch (e) {
                logger.error(`\nError handling 'unlink' event for '${path}': ${e.message}`);
            }
        })
        .on('error', (error) => {
            logger.error(`\nWatcher error: ${error.message}`);
        })
        .on('ready', () => {
            logger.info('\nInitial scan complete. Ready for changes.\n');
        });
}

async function clearTmp() {
    try {
        const tmp = [os.tmpdir(), path.join(directoryName, './tmp')];
        const filenames = await Promise.all(tmp.map(async (dirname) => {
            try {
                const files = await readdirSync(dirname);
                return await Promise.all(files.map(async (file) => {
                    try {
                        const filePath = path.join(dirname, file);
                        const stats = await statSync(filePath);
                        if (stats.isFile()) {
                            await unlinkSync(filePath);
                            console.log('Successfully cleared tmp:'.main, filePath.info);
                            return filePath;
                        }
                    } catch (err) {
                        console.error(`Error processing ${file}: ${err.message}`);
                    }
                }));
            } catch (err) {
                console.error(`Error reading directory ${dirname}: ${err.message}`);
                return [];
            }
        }));
        const flattenedFilenames = filenames.flat().filter((file) => file !== null);
        return flattenedFilenames;
    } catch (err) {
        console.error(`Error in clearTmp: ${err.message}`);
        return [];
    } finally {
        setTimeout(clearTmp, 1 * 3600000);
    }
}

async function clearSessions(folder) {
    folder = folder || './' + authFolder;
    try {
        const filenames = await readdirSync(folder);
        const deletedFiles = await Promise.all(filenames.map(async (file) => {
            try {
                const filePath = path.join(folder, file);
                const stats = await statSync(filePath);
                if (stats.isFile() && file !== 'creds.json') {
                    await unlinkSync(filePath);
                    console.log('Deleted session:'.main, filePath.info);
                    return filePath;
                }
            } catch (err) {
                console.error(`Error processing ${file}: ${err.message}`);
            }
        }));
        return deletedFiles.filter((file) => file !== null);
    } catch (err) {
        console.error(`Error in Clear Sessions: ${err.message}`);
        return [];
    } finally {
        setTimeout(() => clearSessions(folder), 1 * 86400000);
    }
}

async function _quickTest() {
    let test = await Promise.allSettled([
        spawn('ffmpeg'),
        spawn('ffprobe'),
        spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
        spawn('convert'),
        spawn('magick'),
        spawn('gm'),
        spawn('find', ['--version'])
    ].map(p => {
        return Promise.race([
            new Promise(resolve => {
                p.on('close', code => {
                    resolve(code !== 127)
                })
            }),
            new Promise(resolve => {
                p.on('error', _ => resolve(false))
            })
        ])
    }));

    let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test.map(result => result.status === 'fulfilled' ? result.value : false);

    console.log(test);

    let s = global.support = {
        ffmpeg,
        ffprobe,
        ffmpegWebp,
        convert,
        magick,
        gm,
        find
    };

    Object.freeze(global.support);

    if (!s.ffmpeg)(conn?.logger || console).warn('Please install ffmpeg for sending videos (pkg install ffmpeg)');
    if (s.ffmpeg && !s.ffmpegWebp)(conn?.logger || console).warn('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)');
    if (!s.convert && !s.magick && !s.gm)(conn?.logger || console).warn('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)');
}

async function createCertificate() {
    const certFilePath = path.join(process.cwd(), 'ssl', 'certs', 'lets-encrypt-x3-cross-signed.pem');

    if (!existsSync(certFilePath)) {
        try {
            const buffer = await fetch('https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem.txt').then(response => response.text()).catch(() => '');
            writeFileSync(certFilePath, buffer);
        } catch (error) {
            console.error('Error downloading certificate:', error);
            return;
        }
    }

    process.env.NODE_EXTRA_CA_CERTS = certFilePath;
}
