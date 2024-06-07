import {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC,
  DisconnectReason
} from "@whiskeysockets/baileys";
import {
  makeWASocket
} from '../../lib/simple.js';
import path from 'path';
import {
  fileURLToPath,
  pathToFileURL
} from 'url';
import fs from "fs";
import pino from "pino";
import NodeCache from "node-cache";
import yargs from 'yargs';
let isInit = false;
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  if (!text) {
    return m.reply(`Masukkan Nomor!\n\nContoh: *${usedPrefix + command}* ${m.sender.split("@")[0]}`);
  }
  if (!conn.user.jid) {
    return m.reply(`Tidak dapat membuat *Jadibot* pada ${conn.user.jid.split("@")[0]}`);
  }
  const __dirname = await __dirname(process.argv[1]);
  const {
    state,
    saveCreds
  } = await useMultiFileAuthState("jadibot/" + m.sender.split("@")[0]);
  const {
    version
  } = await fetchLatestBaileysVersion();
  const msgRetryCounterCache = new NodeCache();
  const config = {
    printQRInTerminal: false,
    mobile: false,
    version,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    msgRetryCounterCache,
    defaultQueryTimeoutMs: undefined,
    logger: pino({
      level: 'fatal'
    }),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino().child({
        level: 'silent',
        stream: 'store'
      })),
    },
  };
  connection = makeWASocket(config);
  connection.ev.on('connection.update', async (update) => {
    const {
      connection,
      lastDisconnect
    } = update;
    if (connection === 'connecting') {
      conn.reply(m.chat, `Menghubungkan dengan Jadibot...\n*${wait}*`, m);
    } else if (connection === 'open') {
      conn.reply(m.chat, `Terhubung dengan *Jadibot*\n\n• Peserta: *@${m.sender.split("@")[0]}*`, m);
    } else if (connection === 'close') {
      conn.reply(m.chat, `Tidak terhubung dengan *Jadibot*.`, m);
    }
    if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output
      .statusCode !== DisconnectReason.loggedOut) {
      console.log(await reloadHandler(true));
    }
  });
  async function reloadHandler(restartConn) {
    let Handler = await import('../../handler.js');
    let handler = Handler;
    if (restartConn) {
      try {
        connection.ws.close();
      } catch {}
      connection = {
        ...connection,
        ...makeWASocket(config)
      };
      if (!isInit) {
        connection.ev.off('messages.upsert', connection.handler);
        connection.ev.off('group-participants.update', connection.participantsUpdate);
        connection.ev.off('message.delete', connection.onDelete);
        connection.ev.off('connection.update', connection.connectionUpdate);
        connection.ev.off('creds.update', connection.credsUpdate);
      }
      connection.handler = handler.handler.bind(connection);
      connection.participantsUpdate = handler.participantsUpdate.bind(connection);
      connection.onDelete = handler.deleteUpdate.bind(connection);
      connection.connectionUpdate = connectionUpdate.bind(connection);
      connection.credsUpdate = saveCreds.bind(connection);
      connection.ev.on('messages.upsert', connection.handler);
      connection.ev.on('group-participants.update', connection.participantsUpdate);
      connection.ev.on('message.delete', connection.onDelete);
      connection.ev.on('connection.update', connection.connectionUpdate);
      connection.ev.on('creds.update', connection.credsUpdate);
      isInit = false;
      return true;
    }
  }
  if (!connection.authState.creds.registered) {
    setTimeout(async () => {
      let phoneNumber = text.replace(/[^0-9]/g, '');
      if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        phoneNumber = text.replace(/[^0-9]/g, '');
      }
      try {
        const code = await connection.requestPairingCode(phoneNumber);
        const yourCode = code?.match(/.{1,4}/g)?.join("-") || code;
        const msgReply = conn.reply(m.chat,
          '```Masukkan kode dibawah ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk perangkat tertaut\n3. Ketuk tautkan perangkat\n4. Ketuk tautkan dengan nomer telepon saja\n5. Masukkan kode di bawah ini\n\nNote: kode dapat expired kapan saja!```',
          m);
        conn.reply(m.chat, yourCode, msgReply);
      } catch (error) {
        console.error('Error requesting pairing code:', error);
        conn.reply(m.chat, 'Gagal membuat bot sementara, coba lagi nanti.', m);
      }
    }, 3000);
  }
  reloadHandler();
};
handler.help = ["pairing"];
handler.tags = ["owner"];
handler.command = /^(pairing)$/i;
handler.owner = true;
export default handler;
