import fs from "fs";
import path from "path";

const handler = async (m, { conn }) => {
    // Array of audio file paths
    const baka = [
        "./vn/baka.mp3",
        "./vn/baka1.mp3",
    ];

    // Randomly select an audio file from the baka array
    let audioFile = baka[Math.floor(Math.random() * baka.length)];

    // Check if the audio file exists
    if (fs.existsSync(audioFile)) {
        await conn.sendFile(m.chat, audioFile, "ara.mp3", null, m, true, {
            type: "audioMessage",
            ptt: true,
        });
    } else {
        console.error("File not found:", audioFile);
        m.reply("❌ File audio tidak ditemukan.");
    }
};

handler.customPrefix = /^(Baka|baka|goblog)$/i;
handler.command = new RegExp();

export default handler;
