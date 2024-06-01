import util from "util";
import path from "path";

let handler = async (m, { conn }) => {
    // Randomly select an audio file from the baka array
    let audioFile = baka[Math.floor(Math.random() * baka.length)];
    
    await conn.sendFile(m.chat, audioFile, "ara.mp3", null, m, true, {
        type: "audioMessage",
        ptt: true,
    });
};

handler.customPrefix = /^(Baka|baka|goblog)$/i;
handler.command = new RegExp();

export default handler;

const baka = [
    "./vn/baka.mp3",
    "./vn/baka1.mp3",
];
