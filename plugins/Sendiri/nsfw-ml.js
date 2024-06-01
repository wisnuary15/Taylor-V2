import fetch from 'node-fetch';
import moment from 'moment-timezone';
import fs from 'fs';
import path from 'path';
import util from 'util';

let handler = async (m, { conn }) => {
    try {
        let response = await fetch("https://raw.githubusercontent.com/AmmarrBN/dbbot/main/nsfw/nsfwml.json");
        let json = await response.json();
        let waifuUrl = pickRandom(json);

        let waifu = await (await fetch(waifuUrl)).buffer();
        await conn.sendFile(m.chat, waifu, null, "Tcih Sange Ama Kartun~~", m);

        let vnPath = ucapan();
        await conn.sendFile(m.chat, vnPath, "ehe.mp3", null, m, true, {
            type: "audioMessage",
            ptt: true,
        });
    } catch (error) {
        console.error(error);
        m.reply("❌ Terjadi kesalahan saat mengambil data.");
    }
};

handler.command = /^(nsfwml)$/i;
handler.tags = ['nsfw'];
handler.help = ['nsfwml'];
handler.private = true;
handler.register = false;
handler.berlian = true;

export default handler;

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH');
    let res = "./vn/ara.mp3";

    if (time >= 4) {
        res = "./vn/ara1.mp3";
    }
    if (time > 10) {
        res = "./vn/ara2.mp3";
    }
    if (time >= 15) {
        res = "./vn/ara3.mp3";
    }
    if (time >= 18) {
        res = "./vn/ara4.mp3";
    }

    return res;
}
