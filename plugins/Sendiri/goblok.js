import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Dapatkan direktori saat ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn }) => {
    // Array of audio file paths
    const baka = [
        path.resolve(__dirname, "vn/baka.mp3"),
        path.resolve(__dirname, "vn/baka1.mp3"),
    ];

    // Randomly select an audio file from the baka array
    let audioFile = baka[Math.floor(Math.random() * baka.length)];

    // Check if the audio file exists
    if (fs.existsSync(audioFile)) {
        try {
            await conn.sendFile(m.chat, audioFile, "ara.mp3", null, m, true, {
                type: "audioMessage",
                ptt: true,
            });
        } catch (error) {
            console.error("Error sending audio file:", error);
            m.reply("❌ Terjadi kesalahan saat mengirim file audio.");
        }
    } else {
        console.error("File not found:", audioFile);
        m.reply("❌ File audio tidak ditemukan.");
    }
};

handler.customPrefix = /^(Baka|baka|goblog)$/i;
handler.command = new RegExp();

export default handler;
