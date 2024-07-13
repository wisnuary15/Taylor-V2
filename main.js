import os from "os";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
process.env["NODE_ENV"] = "production";
process.env["V8_ENABLE_WEBASSEMBLY"] = 1;
process.env["V8_CONTEXT_ALIGNMENT"] = 64;
process.env["V8_DEPRECATION_WARNINGS"] = false;
process.env["V8_TURBOFAN_BACKEND"] = 1;
process.env["V8_TURBOFAN_INTRINSICS"] = 1;
const totalMemMB = Math.floor(os.totalmem() / (1024 * 1024));
process.env["UV_THREADPOOL_SIZE"] = totalMemMB <= 1024 ? "4" : totalMemMB <= 2048 ? "8" : os.cpus()?.length * 2;
import {
  loadConfig
} from "./config.js";
import Helper from "./lib/helper.js";
import {
  createRequire
} from "module";
import path from "path";
import {
  fileURLToPath,
  pathToFileURL
} from "url";
import {
  platform
} from "process";
import * as glob from "glob";
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
} from "fs";
import fs from "fs/promises";
import yargs from "yargs";
import {
  spawn
} from "child_process";
import _ from "lodash";
import chalk from "chalk";
import ora from "ora";
const spinner = ora({
  spinner: "moon",
  color: "blue",
  text: "Loading...\n",
  prefixText: chalk.bold.green("Progress:"),
  isEnabled: true,
  hideCursor: true
});
import syntaxerror from "syntax-error";
import chokidar from "chokidar";
import {
  format,
  inspect,
  promisify,
  isDeepStrictEqual
} from "util";
import colors from "colors";
import {
  Boom
} from "@hapi/boom";
import {
  default as Pino
} from "pino";
import {
  default as PinoPretty
} from "pino-pretty";
import moment from "moment-timezone";
moment.locale("id");
const stream = PinoPretty({
  sync: true,
  singleLine: false,
  colorize: true,
  levelFirst: false,
  messageKey: "msg",
  timestampKey: "time",
  translateTime: "dd-mmmm-yyyy hh:MM TT",
  ignore: "pid,hostname",
  customColors: "info:bgBlueBright,error:bgRedBright,fatal:bgRedBright,warn:bgYellowBright,debug:bgGreenBright,trace:bgCyanBright",
  messageFormat: "{msg}\n⤵️\n",
  customPrettifiers: {
    payload: value => inspect(value, {
      depth: null,
      breakLength: 4,
      colors: true
    })
  }
});
import {
  makeWASocket,
  protoType,
  serialize
} from "./lib/simple.js";
import {
  Low
} from "lowdb";
import {
  JSONFile
} from "lowdb/node";
import {
  mongoDB,
  mongoDBV2
} from "./lib/mongoDB.js";
import {
  cloudDBAdapter
} from "./lib/cloudDBAdapter.js";
const {
  Browsers,
  fetchLatestWaWebVersion,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  proto,
  PHONENUMBER_MCC,
  delay,
  DisconnectReason,
  makeInMemoryStore,
  useMultiFileAuthState,
  MessageRetryMap
} = await (await import("@whiskeysockets/baileys"))?.default;
import NodeCache from "node-cache";
import inquirer from "inquirer";
import parsePhoneNumber from "awesome-phonenumber";
import single2multi from "./lib/single2multi.js";
import storeSystem from "./lib/store-multi.js";
import {
  parentPort,
  isMainThread,
  Worker
} from "worker_threads";
import {
  writeHeapSnapshot
} from "v8";
const heapdumpOptions = {
  dirname: "tmp",
  prefix: "heapdump_"
};
if (isMainThread) {
  const tmpDir = path.join(process.cwd(), heapdumpOptions.dirname);
  const worker = new Worker(path.join(process.cwd(), "main.js"));
  const heapdumpPromises = [];
  worker.postMessage({
    message: "heapdump",
    options: heapdumpOptions
  });
  worker.on("message", filename => heapdumpPromises.push(filename));
  worker.on("exit", () => Promise.all(heapdumpPromises)?.then(heapdumpFiles => console.log("Heapdump files:", heapdumpFiles))?.catch(error => console.error("Error generating heapdump:", error)));
  worker.on("error", error => console.error("Worker error:", error));
} else {
  parentPort.once("message", async ({
    message,
    options
  }) => {
    if (message === "heapdump") {
      try {
        const filename = await generateHeapDump(options);
        parentPort.postMessage(filename);
      } catch (error) {
        console.error("Error generating heapdump:", error);
      }
    }
  });
  parentPort.once("error", error => console.error("Parent port error:", error));
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
const pairingCode = Helper.opts["pairing-code"];
const useMobile = Helper.opts["mobile"];
const useQr = Helper.opts["qr"];
const singleToMulti = Helper.opts["singleauth"];
const askQuestion = async text => {
  console.clear();
  const answer = await inquirer.prompt({
    type: "input",
    name: "input",
    message: text,
    prefix: "📱",
    validate: value => {
      if (!/^\+?\d+$/.test(value)) console.clear();
      return /^\+?\d+$/.test(value) || "Format nomor ponsel tidak valid. Masukkan nomor ponsel sesuai format internasional.\n(format internasional, contoh: +1234567890 atau 1234567890)";
    },
    onClose: () => console.log(chalk.yellow("Prompt ditutup."))
  });
  const result = answer.input;
  console.log(chalk.bgGreen.black("\n🎉 Berhasil untuk nomor:"), chalk.yellow(result));
  return result;
};
const msgRetryCounterCache = new NodeCache();
const msgRetryCounterMap = MessageRetryMap => {};
const PORT = process.env["PORT"] || process.env["SERVER_PORT"] || 3e3;
protoType();
serialize();
await loadConfig();
global.API = Helper.API;
Object.assign(global, {
  ...Helper,
  timestamp: {
    start: Date.now()
  }
});
const directoryName = Helper.__dirname(import.meta.url);
global.opts = new Object(Helper.opts);
global.prefix = Helper.prefix;
const dbUrl = opts.db || opts.dbv2 || "";
const dbName = opts._[0] ? `${opts._[0]}_database.json` : "database.json";
const dbInstance = !dbUrl ? new JSONFile(dbName) : /^https?:\/\//.test(dbUrl) ? new cloudDBAdapter(dbUrl) : /^mongodb(\+srv)?:\/\//i.test(dbUrl) && opts.db ? new mongoDB(dbUrl) : /^mongodb(\+srv)?:\/\//i.test(dbUrl) && opts.dbv2 ? new mongoDBV2(dbUrl) : new JSONFile(dbName);
global.db = new Low(dbInstance);
global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  const db = global.db;
  return db.READ ? new Promise(resolve => {
    const intervalId = setInterval(async () => {
      if (!db.READ) {
        clearInterval(intervalId);
        resolve(db.data === null ? await global.loadDatabase() : db.data);
      }
    }, 1 * 1e3);
  }) : db.data === null ? (db.READ = true, await db.read()?.catch(console.error), db.READ = null, db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    database: {},
    ...db.data || {}
  }, db.chain = _.chain(db.data), null) : null;
};
await loadDatabase();
const {
  version,
  isLatest
} = await fetchLatestBaileysVersion()?.catch(() => fetchLatestWaWebVersion());
global.authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ""}TaylorSession`);
global.authFile = `${Helper.opts._[0] || "session"}.data.json`;
const [isCredsExist, isAuthSingleFileExist, authState] = await Promise.all([Helper.checkFilesExist(authFolder + "/creds.json"), Helper.checkFilesExist(authFile), useMultiFileAuthState(authFolder) || storeSystem.useMultiFileAuthState(authFolder)]);
const logger = Pino({
  level: "fatal",
  serializers: {
    err: Pino.stdSerializers?.err
  }
}, stream);
process.on("unhandledRejection", (err, promise) => logger.error({
  err: err,
  promise: promise
}, "Unhandled Rejection"))?.on("rejectionHandled", promise => logger.error({
  promise: promise
}, "Rejection Handled"))?.on("uncaughtException", (err, origin) => logger.error({
  err: err,
  origin: origin
}, "Uncaught Exception"))?.on("unhandledPromiseRejection", (reason, promise) => logger.error({
  reason: reason,
  promise: promise
}, "Unhandled Promise Rejection"))?.on("SIGTERM", () => logger.error("Received SIGTERM signal"))?.on("SIGINT", () => logger.error("Received SIGINT signal"))?.on("SIGUSR1", () => logger.error("Received SIGUSR1 signal"))?.on("SIGUSR2", () => logger.error("Received SIGUSR2 signal"))?.on("beforeExit", code => logger.warn({
  code: code
}, "Process Before Exit"))?.on("exit", code => logger.error({
  code: code
}, "Process Exit"))?.on("warning", warning => null)?.on("disconnect", () => logger.warn("Node Disconnected"))?.on("message", message => logger.info({
  message: message
}, "Node Message"))?.on("multipleResolves", (type, promise) => null)?.on("childProcess", childProcess => logger.info({
  childProcess: childProcess
}, "Child Process Event"));
global.store = makeInMemoryStore({
  logger: logger
}) || storeSystem.makeInMemoryStore({
  logger: logger
});
if (Helper.opts["singleauth"] || Helper.opts["singleauthstate"]) {
  if (!isCredsExist && isAuthSingleFileExist) {
    console.debug(chalk.bold.blue("- singleauth -"), chalk.bold.yellow("creds.json not found"), chalk.bold.green("compiling singleauth to multiauth..."));
    await single2multi(authFile, authFolder, authState);
    console.debug(chalk.bold.blue("- singleauth -"), chalk.bold.green("compiled successfully"));
    authState = await useMultiFileAuthState(authFolder) || await storeSystem.useMultiFileAuthState(authFolder);
  } else if (!isAuthSingleFileExist) console.error(chalk.bold.blue("- singleauth -"), chalk.bold.red("singleauth file not found"));
}
const storeFile = `${Helper.opts._[0] || "data"}.store.json`;
store?.readFromFile(storeFile);
const connectionOptions = {
  version: version,
  logger: logger,
  ...!pairingCode && !useMobile && !useQr && {
    printQRInTerminal: false,
    mobile: !useMobile
  },
  ...pairingCode && {
    printQRInTerminal: !pairingCode
  },
  ...useMobile && {
    mobile: !useMobile
  },
  ...useQr && {
    printQRInTerminal: true
  },
  auth: {
    creds: authState.state?.creds,
    keys: makeCacheableSignalKeyStore(authState.state?.keys, logger.child({
      level: "fatal",
      stream: "store"
    }))
  },
  browser: ["Ubuntu", "Edge", "110.0.1587.56"] || Browsers.macOS("Safari"),
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  getMessage: async key => {
    if (store) {
      const jid = jidNormalizedUser(key.remoteJid);
      const msg = await store?.loadMessage(jid, key.id);
      return msg?.message || "";
    }
    return proto.Message.fromObject({
      conversation: "Taylor-V2"
    });
  },
  patchMessageBeforeSending: message => {
    const requiresPatch = !!(message.buttonsMessage || message.listMessage || message.templateMessage);
    if (requiresPatch) {
      message = {
        viewOnceMessageV2: {
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
  msgRetryCounterCache: msgRetryCounterCache,
  msgRetryCounterMap: msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined
};
global.conn = makeWASocket(connectionOptions);
store?.bind(conn?.ev);
conn.isInit = false;
global.isQuestion = false;
if (pairingCode && !conn.authState.creds.registered) {
  if (useMobile) {
    console.log("\nCannot use pairing code with mobile api");
  }
  global.isQuestion = true;
  console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
  console.log(chalk.bold.redBright(`📨 ${"Please type your WhatsApp number"}:`));
  console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
  let phoneNumber = await askQuestion(`   ${chalk.bold.cyan("- Number")}: `);
  console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
  phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
  if (!Object.keys(PHONENUMBER_MCC)?.some(v => phoneNumber.startsWith(v))) {
    console.log(chalk.bold.cyan("╭─────────────────────────────────────────────────···"));
    console.log(chalk.bold.redBright(`💬 ${"Start with your country's WhatsApp code, Example 62xxx"}:`));
    console.log(chalk.bold.cyan("╰─────────────────────────────────────────────────···"));
    global.isQuestion = true;
    console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
    console.log(chalk.bold.redBright(`📨 ${"Please type your WhatsApp number"}:`));
    console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
    phoneNumber = await askQuestion(`   ${chalk.bold.cyan("- Number")}: `);
    console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
  }
  await delay(3e3);
  let code = await conn?.requestPairingCode(phoneNumber);
  code = code?.match(/.{1,4}/g)?.join("-") || code;
  console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
  console.log(` 💻 ${chalk.bold.redBright("Your Pairing Code")}:`);
  console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
  console.log(`   ${chalk.bold.cyan("- Code")}: ${code}`);
  console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
}
if (useMobile && !conn.authState.creds.registered) {
  const {
    registration
  } = conn.authState.creds || {
    registration: {}
  };
  if (!registration.phoneNumber) {
    global.isQuestion = true;
    console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
    console.log(chalk.bold.redBright(`📨 ${"Please type your WhatsApp number"}:`));
    console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
    let phoneNumber = await askQuestion(`   ${chalk.bold.cyan("- Number")}: `);
    console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    if (!Object.keys(PHONENUMBER_MCC)?.some(v => phoneNumber.startsWith(v))) {
      console.log(chalk.bold.cyan("╭─────────────────────────────────────────────────···"));
      console.log(chalk.bold.redBright(`💬 ${"Start with your country's WhatsApp code, Example 62xxx"}:`));
      console.log(chalk.bold.cyan("╰─────────────────────────────────────────────────···"));
      global.isQuestion = true;
      console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
      console.log(chalk.bold.redBright(`📨 ${"Please type your WhatsApp number"}:`));
      console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
      phoneNumber = await askQuestion(`   ${chalk.bold.cyan("- Number")}: `);
      console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    }
    registration.phoneNumber = "+" + phoneNumber;
  }
  const phoneNumber = parsePhoneNumber(registration.phoneNumber);
  if (!phoneNumber.isValid()) {
    console.log("\nInvalid phone number: " + registration.phoneNumber);
  }
  registration.phoneNumber = phoneNumber.format("E.164");
  registration.phoneNumberCountryCode = phoneNumber.countryCallingCode;
  registration.phoneNumberNationalNumber = phoneNumber.nationalNumber;
  const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode];
  registration.phoneNumberMobileCountryCode = mcc;
  async function enterCode() {
    try {
      global.isQuestion = true;
      console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
      console.log(`📨 ${chalk.bold.redBright("Please Enter Your OTP Code")}:`);
      console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
      const code = await askQuestion(`   ${chalk.bold.cyan("- Code")}: `);
      console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
      const response = await conn?.register(code.replace(/[^0-9]/g, "")?.trim()?.toLowerCase());
      console.log(chalk.bold.cyan("╭─────────────────────────────────────────────────···"));
      console.log(`💬 ${chalk.bold.redBright("Successfully registered your phone number.")}`);
      console.log(chalk.bold.cyan("╰─────────────────────────────────────────────────···"));
      console.log(response);
    } catch (error) {
      console.error("\nFailed to register your phone number. Please try again.\n", error);
      await enterCode();
    }
  }
  async function askOTP() {
    global.isQuestion = true;
    console.log(chalk.bold.cyan("╭──────────────────────────────────────···"));
    console.log(`📨 ${chalk.bold.redBright("What method do you want to use? \"sms\" or \"voice\"")}:`);
    console.log(chalk.bold.cyan("├──────────────────────────────────────···"));
    let code = await askQuestion(`   ${chalk.bold.cyan("- Method")}: `);
    console.log(chalk.bold.cyan("╰──────────────────────────────────────···"));
    code = code.replace(/["']/g, "")?.trim()?.toLowerCase();
    if (code !== "sms" && code !== "voice") return await askOTP();
    registration.method = code;
    try {
      await conn?.requestRegistrationCode(registration);
      await enterCode();
    } catch (error) {
      console.error("\nFailed to request registration code. Please try again.\n", error);
      await askOTP();
    }
  }
  await askOTP();
}

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) return false;
  const keys1 = Object.keys(obj1),
    keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}
async function writeDatabase() {
  try {
    const previousData = JSON.stringify(global.db?.tempData ?? global.db?.data);
    await new Promise(resolve => setTimeout(resolve, 1 * 1e3));
    const newData = JSON.stringify(global.db?.data);
    global.db.tempData = JSON.parse(newData);
    const isEqual = deepEqual(JSON.parse(previousData), JSON.parse(newData));
    await Promise.allSettled([isEqual ? null : global.db.write(global.db.data)]);
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(writeDatabase, 30 * 1e3);
  }
}
if (opts["server"]) {
  (await import("./server.js"))?.default(global.conn, PORT);
}
let timeout = 0;
async function connectionUpdate(update) {
  if (global.isQuestion) return;
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
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket === null) {
    try {
      await global.reloadHandler(true);
    } catch (err) {
      console.error(err);
    }
  }
  if (!global.db.data) await loadDatabase();
  if (connection === "connecting") {
    spinner.text = chalk.bgYellow.black("Connecting...\n");
    spinner.start();
    timeout++;
    console.log(chalk.bold.redBright("⚡ Mengaktifkan Bot, Mohon tunggu sebentar..."));
    if (timeout > 30) {
      console.log("Taylor-V2".main, ">>".yellow, `Session logout after 30 times reconnecting, This action will save your number from banned!`.warn);
      setImmediate(() => process.exit(1));
    }
  }
  if (connection === "open") {
    try {
      const {
        jid
      } = conn.user;
      const name = conn.getName(jid);
      conn.user.name = name || "Taylor-V2";
      spinner.succeed(chalk.bgYellow.black(`Connected, you login as ${conn.user.name || conn.user.verifiedName}\n`));
      const currentTime = moment.tz("Asia/Makassar");
      const pingSpeed = new Date() - currentTime;
      const formattedPingSpeed = pingSpeed < 0 ? "N/A" : `${pingSpeed}ms`;
      console.log("Taylor-V2".main, ">>".yellow, `Client connected on: ${conn?.user?.id.split(":")[0] || global.namebot}`.info);
      const infoMsg = `🤖 *Bot Info* 🤖\n🕰️ *Current Time:* ${currentTime.format("HH:mm:ss")}\n👤 *Name:* *${name || "Taylor"}*\n🏷️ *Tag:* *@${jid.split("@")[0]}*\n⚡ *Ping Speed:* *${formattedPingSpeed}*\n📅 *Date:* ${currentTime.format("YYYY-MM-DD")}\n🕒 *Time:* ${currentTime.format("HH:mm:ss")}\n📆 *Day:* ${currentTime.format("dddd")}\n📝 *Description:* Bot *${name || "Taylor-V"}* is now active.`;
      const messg = await conn?.sendMessage(`${nomorown}@s.whatsapp.net`, {
        text: infoMsg,
        mentions: [nomorown + "@s.whatsapp.net", jid]
      }, {});
      if (!messg) logger.error(`\nError Send Message'\n${inspect(e)}'`);
    } catch (e) {
      logger.error(`\nError Connection'\n${inspect(e)}'`);
    }
    await runTasks();
    Object.freeze(global.reload);
    console.log(chalk.bold.green("Connected! 🔒✅"));
  }
  if (connection === "close" || code) {
    spinner.fail(chalk.bgRed.white(`Can't connect to Web Socket\n`));
    try {
      const reason = lastDisconnect && lastDisconnect.error ? new Boom(lastDisconnect.error)?.output.statusCode : 500;
      switch (reason) {
        case DisconnectReason.connectionClosed:
          console.log(chalk.bold.red("Connection closed! 🔒"));
          return;
        case DisconnectReason.connectionLost:
          console.log(chalk.bold.cyan("Connection lost from server! 📡"));
          return;
        case DisconnectReason.restartRequired:
          console.log(chalk.bold.cyan("Restart required, restarting... 🔄"));
          return;
        case DisconnectReason.timedOut:
          console.log(chalk.bold.red("Connection timed out! ⌛"));
          return;
        default:
          console.log(chalk.bold.red("Connection closed with bot. Trying to run again. ⚠️"));
          return;
      }
    } catch (error) {
      console.error(chalk.bold.red("Error occurred during connection close:"), error.message);
    }
  }
  if (isOnline === true) logger.info(chalk.bold.green("Status Aktif"));
  else if (isOnline === false) logger.error(chalk.bold.red("Status Mati"));
  if (receivedPendingNotifications) logger.warn(chalk.bold.yellow("Menunggu Pesan Baru"));
  if ((!pairingCode && !useMobile || useQr) && qr !== 0 && qr !== undefined && connection === "close") {
    if (!useMobile) logger.error(chalk.bold.yellow(`\n🚩 Koneksi ditutup, harap hapus folder ${authFolder} dan pindai ulang kode QR`));
    else logger.info(chalk.bold.yellow(`\n🚩 Pindai kode QR ini, kode QR akan kedaluwarsa dalam 60 detik.`));
    setImmediate(() => process.exit(1));
  }
}
let isInit = true;
let handler = await import("./handler.js");
global.reloadHandler = async function reloadHandler(restatConn) {
  try {
    const Handler = (await import(`./handler.js?update=${Date.now()}`))?.catch(console.error);
    if (Object.keys(Handler || {})?.length) handler = Handler;
  } catch (error) {
    console.error;
  }
  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch (e) {
      console.error(e);
    }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, {
      chats: oldChats
    });
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off("messages.upsert", conn.handler);
    conn.ev.off("messages.update", conn.pollUpdate);
    conn.ev.off("group-participants.update", conn.participantsUpdate);
    conn.ev.off("groups.update", conn.groupsUpdate);
    conn.ev.off("message.delete", conn.onDelete);
    conn.ev.on("call", conn.onCall);
    conn.ev.off("presence.update", conn.presenceUpdate);
    conn.ev.off("connection.update", conn.connectionUpdate);
    conn.ev.off("creds.update", conn.credsUpdate);
  }
  const emoji = {
    welcome: "👋",
    bye: "👋",
    promote: "👤👑",
    demote: "👤🙅‍♂️",
    desc: "📝",
    subject: "📌",
    icon: "🖼️",
    revoke: "🔗",
    announceOn: "🔒",
    announceOff: "🔓",
    restrictOn: "🚫",
    restrictOff: "✅"
  };
  conn.welcome = `${emoji.welcome} Hallo @user\n\n   *W E L C O M E*\n⫹⫺ Di grup @subject\n\n⫹⫺ Baca *DESKRIPSI*\n@desc`;
  conn.bye = `   *G O O D B Y E*\n${emoji.bye} Sampai jumpa @user`;
  conn.spromote = `${emoji.promote} @user sekarang menjadi admin!`;
  conn.sdemote = `${emoji.demote} @user tidak lagi menjadi admin!`;
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
  conn.onCall = handler.callUpdate.bind(global.conn);
  conn.presenceUpdate = handler.presenceUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = authState.saveCreds.bind(global.conn, true);
  const currentDateTime = new Date();
  const messageDateTime = new Date(conn.ev);
  let chats;
  if (_.gte(currentDateTime, messageDateTime)) {
    chats = _.chain(conn.chats)?.omitBy((chat, jid) => jid.endsWith("@g.us") || !chat.isChats)?.keys()?.value();
  } else {
    chats = _.chain(conn.chats)?.omitBy((chat, jid) => jid.endsWith("@g.us") || !chat.isChats)?.keys()?.value();
  }
  conn.ev.on("messages.upsert", conn.handler);
  conn.ev.on("messages.update", conn.pollUpdate);
  conn.ev.on("group-participants.update", conn.participantsUpdate);
  conn.ev.on("groups.update", conn.groupsUpdate);
  conn.ev.on("message.delete", conn.onDelete);
  conn.ev.on("call", conn.onCall);
  conn.ev.on("presence.update", conn.presenceUpdate);
  conn.ev.on("connection.update", conn.connectionUpdate);
  conn.ev.on("creds.update", conn.credsUpdate);
  isInit = false;
  return true;
};
await global.reloadHandler();
const runTasks = async () => {
  const tasks = [{
    func: _quickTest,
    message: "Quick Test"
  }, {
    func: writeDatabase,
    message: "Write database"
  }, {
    func: loadConfig,
    message: "Reload Config"
  }, {
    func: filesInit,
    message: "Initializing files"
  }, {
    func: libFiles,
    message: "Loading library files"
  }, {
    func: watchFiles,
    message: "Watching files"
  }, {
    func: () => watch(path.resolve(directoryName, "plugins"), global.reload),
    message: "Watching plugins"
  }, {
    func: clearTmp,
    message: "Clearing temporary files"
  }, {
    func: clearSessions,
    message: "Clearing sessions"
  }];
  const executeTask = async ({
    func,
    message
  }) => {
    try {
      spinner.text = chalk.bgYellow.black("Running tasks\n");
      spinner.start();
      await func();
      spinner.text = chalk.bgYellow.black(message + "\n");
      spinner.succeed(chalk.bgYellow.black(message + "\n"));
      return {
        status: "fulfilled",
        message: message
      };
    } catch (error) {
      spinner.fail(`Error occurred while running ${message}.\n`);
      console.error(`Error occurred while running ${message}:`, error);
      return {
        status: "rejected",
        message: message,
        error: error
      };
    }
  };
  try {
    const results = await Promise.allSettled(_.map(tasks, executeTask));
    const errors = results.filter(result => result.status === "rejected")?.map(error => inspect(error.reason));
    if (errors.length > 0) {
      console.error(errors.join("\n"));
    }
    spinner.text = chalk.bgYellow.black("All tasks completed.\n");
    spinner.succeed(chalk.bgYellow.black("All tasks completed."));
  } catch (error) {
    console.error("Error occurred while running tasks:", error);
  } finally {
    spinner.stop();
  }
};
const pluginFilter = filename => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  const CommandsFiles = glob.sync(path.resolve(path.resolve(directoryName, "plugins"), "**/*.js"), {
    ignore: ["**/node_modules/**", "**/run.js"]
  });
  const importPromises = _.map(CommandsFiles, async file => {
    const moduleName = path.join("/plugins", path.relative(path.resolve(directoryName, "plugins"), file));
    try {
      const fileContent = readFileSync(file, "utf-8");
      const err = syntaxerror(fileContent, file, {
        sourceType: "module",
        ecmaVersion: 2020,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
      });
      if (err) {
        delete global.plugins[moduleName];
        return {
          moduleName: moduleName,
          filePath: file,
          message: err.message,
          error: err.message,
          success: false
        };
      } else {
        const module = await import(file);
        global.plugins[moduleName] = module.default || module;
        return {
          moduleName: moduleName,
          filePath: file,
          success: true
        };
      }
    } catch (e) {
      logger.error(e);
      delete global.plugins[moduleName];
      return {
        moduleName: moduleName,
        filePath: file,
        message: e.message,
        error: e,
        success: false
      };
    }
  });
  try {
    const results = await Promise.all(_.map(importPromises, promise => promise.then(value => ({
      status: "fulfilled",
      value: value
    }))?.catch(reason => ({
      status: "rejected",
      reason: reason
    }))));
    const successResults = _.map(_.filter(results, {
      status: "fulfilled"
    }), result => result.value.moduleName);
    const errorResults = _.map(_.filter(results, {
      status: "rejected"
    }), result => ({
      filePath: result.reason.filePath,
      error: result.reason.error
    }));
    global.plugins = _.chain(global.plugins)?.toPairs()?.sortBy(([a]) => a)?.fromPairs()?.value();
    const loadedPluginsMsg = `Loaded ${CommandsFiles.length} JS Files total.`;
    const successPluginsMsg = `✅ Success Plugins:\n${successResults.length} total.`;
    const errorPluginsMsg = `❌ Error Plugins:\n${errorResults.length} total`;
    logger.warn(loadedPluginsMsg);
    logger.info(successPluginsMsg);
    logger.error(errorPluginsMsg);
    const errorMessagesText = errorResults.map((error, index) => `❗ *Error ${index + 1}:* ${error.filePath}\n - ${error.error.message}`)?.join("\n");
    const messageText = `- 🤖 *Loaded Plugins Report* 🤖\n` + `🔧 *Total Plugins:* ${CommandsFiles.length}\n` + `✅ *Success:* ${successResults.length}\n` + `❌ *Error:* ${errorResults.length}\n` + (errorResults.length > 0 ? errorMessagesText : "");
    const messg = await conn?.sendMessage(`${nomorown}@s.whatsapp.net`, {
      text: messageText
    }, {});
    if (!messg) logger.error(`\nError sending message`);
  } catch (e) {
    logger.error(`\nError sending message: ${e}`);
  }
}
global.lib = {};
async function libFiles() {
  const CommandsFiles = glob.sync(path.resolve(path.resolve(Helper.__dirname(import.meta.url), "lib"), "**/*.js"), {
    ignore: ["**/node_modules/**", "**/run.js"]
  });
  const importPromises = _.map(CommandsFiles, async file => {
    const moduleName = path.join("/lib", path.relative(path.resolve(Helper.__dirname(import.meta.url), "lib"), file));
    try {
      const fileContent = await readFileSync(file, "utf-8");
      const err = syntaxerror(fileContent, file, {
        sourceType: "module",
        ecmaVersion: 2020,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
      });
      if (err) {
        delete global.lib[moduleName.slice(0, -3)];
        return {
          moduleName: moduleName,
          filePath: file,
          error: err.message,
          success: false
        };
      } else {
        const module = (await import(file))?.default || await import(file);
        setNestedObject(global.lib, moduleName.slice(0, -3), module);
        return {
          moduleName: moduleName,
          filePath: file,
          success: true
        };
      }
    } catch (e) {
      logger.error(e);
      delete global.lib[moduleName.slice(0, -3)];
      return {
        moduleName: moduleName,
        filePath: file,
        error: e,
        success: false
      };
    }
  });
  try {
    const results = await Promise.all(_.map(importPromises, promise => promise.then(value => ({
      status: "fulfilled",
      value: value
    }))?.catch(reason => ({
      status: "rejected",
      reason: reason
    }))));
    const successResults = _.map(_.filter(results, {
      status: "fulfilled"
    }), result => result.value.moduleName);
    const errorResults = _.map(_.filter(results, {
      status: "rejected"
    }), result => ({
      filePath: result.reason.filePath,
      error: result.reason.error
    }));
    global.lib = _.chain(global.lib[""]?.lib)?.toPairs()?.sortBy(([a]) => a)?.fromPairs()?.value();
    const loadedLibsMsg = `Loaded ${CommandsFiles.length} JS Files total.`;
    const successLibsMsg = `✅ Success Lib:\n${successResults.length} total.`;
    const errorLibsMsg = `❌ Error Lib:\n${errorResults.length} total`;
    logger.warn(loadedLibsMsg);
    logger.info(successLibsMsg);
    logger.error(errorLibsMsg);
    const errorMessagesText = errorResults.map((error, index) => `❗ *Error ${index + 1}:* ${error.filePath}\n - ${error.error.message}`)?.join("\n");
    const messageText = `- 🤖 *Loaded Libs Report* 🤖\n` + `🔧 *Total Libs:* ${CommandsFiles.length}\n` + `✅ *Success:* ${successResults.length}\n` + `❌ *Error:* ${errorResults.length}\n` + (errorResults.length > 0 ? errorMessagesText : "");
    logger.info(messageText);
  } catch (e) {
    logger.error(`Error occurred while importing libraries: ${e}`);
  }
}
const setNestedObject = (obj, path, value) => path.split("/")?.reduce((acc, key, index, keys) => index === keys.length - 1 ? acc[key] = value : acc[key] = acc[key] || {}, obj);
global.reload = async (_ev, filename) => {
  if (!pluginFilter(filename)) return;
  const dir = path.join(path.resolve(directoryName, "plugins"), filename);
  try {
    if (existsSync(dir)) {
      logger.info(`\nRequiring plugin '${filename}'`);
      const fileContent = await readFileSync(dir, "utf-8");
      const err = syntaxerror(fileContent, filename, {
        sourceType: "module",
        ecmaVersion: 2020,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
      });
      if (err) {
        logger.error(`\nSyntax error while loading '${filename}'\n${inspect(err)}`);
      } else {
        const module = await import(`${Helper.__filename(dir)}?update=${Date.now()}`);
        global.plugins[filename] = module.default || module;
      }
    } else {
      logger.warn(`Deleted plugin '${filename}'`);
      delete global.plugins[filename];
    }
  } catch (e) {
    logger.error(`\nError requiring plugin '${filename}'\n${inspect(e)}`);
  } finally {
    global.plugins = _.chain(global.plugins)?.toPairs()?.sortBy(([a]) => a)?.fromPairs()?.value();
  }
};
async function FileEv(type, file) {
  try {
    const resolvedFile = path.resolve(Helper.__filename(file));
    switch (type) {
      case "delete":
        delete global.plugins[resolvedFile];
        break;
      case "change":
      case "add":
        const module = await import(`${resolvedFile}?update=${Date.now()}`);
        global.plugins[resolvedFile] = module.default || module;
        break;
    }
  } catch (e) {
    logger.error(`\nError processing file event '${type}' for '${file}': ${e.message}`);
  } finally {
    global.plugins = _.chain(global.plugins)?.toPairs()?.sortBy(([a]) => a)?.fromPairs()?.value();
  }
}
async function watchFiles() {
  const watcher = chokidar.watch(["./plugins/**/*.js", "!./node_modules/**/*.js", "!./run.js"], {
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
    persistent: true,
    usePolling: true,
    cwd: directoryName
  });
  watcher.on("add", async path => {
    try {
      logger.info(`\nNew plugin - '${path}'`);
      await FileEv("add", `./${path}`);
    } catch (e) {
      logger.error(`\nError handling 'add' event for '${path}': ${e.message}`);
    }
  })?.on("change", async path => {
    try {
      logger.info(`\nUpdated plugin - '${path}'`);
      await FileEv("change", `./${path}`);
    } catch (e) {
      logger.error(`\nError handling 'change' event for '${path}': ${e.message}`);
    }
  })?.on("unlink", async path => {
    try {
      logger.warn(`Deleted plugin - '${path}'`);
      await FileEv("delete", `./${path}`);
    } catch (e) {
      logger.error(`\nError handling 'unlink' event for '${path}': ${e.message}`);
    }
  })?.on("error", error => {
    logger.error(`\nWatcher error: ${error.message}`);
  })?.on("ready", () => {
    logger.info("\nInitial scan complete. Ready for changes.\n");
  });
}
async function clearTmp() {
  try {
    const tmp = [os.tmpdir(), path.join(directoryName, "./tmp")];
    const filenames = await Promise.all(_.map(tmp, async dirname => {
      try {
        const files = await readdirSync(dirname);
        return await Promise.all(_.map(files, async file => {
          try {
            const filePath = path.join(dirname, file);
            const stats = await statSync(filePath);
            if (stats.isFile()) {
              await unlinkSync(filePath);
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
    const flattenedFilenames = _.filter(_.flatten(filenames), file => file !== null);
    logger.info(`Total files cleared: ${flattenedFilenames.length}`);
    return flattenedFilenames;
  } catch (err) {
    console.error(`Error in clearTmp: ${err.message}`);
    return [];
  } finally {
    setTimeout(clearTmp, 1 * 36e5);
  }
}
async function clearSessions(folder) {
  folder = folder || "./" + authFolder;
  try {
    const filenames = await readdirSync(folder);
    const deletedFiles = await Promise.all(_.map(filenames, async file => {
      try {
        const filePath = path.join(folder, file);
        const stats = await statSync(filePath);
        if (stats.isFile() && file !== "creds.json") {
          await unlinkSync(filePath);
          return filePath;
        }
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }));
    const filteredDeletedFiles = _.filter(deletedFiles, file => file !== null);
    logger.info(`Total sessions deleted: ${filteredDeletedFiles.length}`);
    return filteredDeletedFiles;
  } catch (err) {
    console.error(`Error in Clear Sessions: ${err.message}`);
    return [];
  } finally {
    setTimeout(() => clearSessions(folder), 1 * 864e5);
  }
}
async function _quickTest() {
  let commands = [spawn("ffmpeg"), spawn("ffprobe"), spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-filter_complex", "color", "-frames:v", "1", "-f", "webp", "-"]), spawn("convert"), spawn("magick"), spawn("gm"), spawn("find", ["--version"])];
  let test = await Promise.allSettled(_.map(commands, p => {
    return Promise.race([new Promise(resolve => {
      p.on("close", code => {
        resolve(code !== 127);
      });
    }), new Promise(resolve => {
      p.on("error", _ => resolve(false));
    })]);
  }));
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = _.map(test, result => result.status === "fulfilled" ? result.value : false);
  let s = global.support = {
    ffmpeg: ffmpeg,
    ffprobe: ffprobe,
    ffmpegWebp: ffmpegWebp,
    convert: convert,
    magick: magick,
    gm: gm,
    find: find
  };
  Object.freeze(global.support);
  if (!s.ffmpeg)(conn?.logger || console)?.warn("Please install ffmpeg for sending videos (pkg install ffmpeg)");
  if (s.ffmpeg && !s.ffmpegWebp)(conn?.logger || console)?.warn("Stickers may not animate without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)");
  if (!s.convert && !s.magick && !s.gm)(conn?.logger || console)?.warn("Stickers may not work without imagemagick if libwebp on ffmpeg isn't installed (pkg install imagemagick)");
}
