import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const handler = async (m, { conn }) => {
    // Array of audio file paths
    const baka = [
        path.resolve(__dirname, "vn/baka.mp3"),
        path.resolve(__dirname, "vn/baka1.mp3"),
    ];

    // Randomly select an audio file from the baka array
    let audioFile = baka[Math.floor(Math.random() * baka.length)];
    let convertedAudioFile = path.resolve(__dirname, "vn/converted_baka.mp3");

    // Check if the audio file exists
    if (fs.existsSync(audioFile)) {
        // Convert the audio file to ensure compatibility
        ffmpeg(audioFile)
            .audioCodec('libmp3lame')
            .audioBitrate(128)
            .audioChannels(2)
            .audioFrequency(44100)
            .output(convertedAudioFile)
            .on('end', async () => {
                try {
                    await conn.sendFile(m.chat, convertedAudioFile, "ara.mp3", null, m, true, {
                        type: "audioMessage",
                        ptt: true,
                    });
                } catch (error) {
                    console.error("Error sending audio file:", error);
                    m.reply("❌ Terjadi kesalahan saat mengirim file audio.");
                }
            })
            .on('error', (err) => {
                console.error("Error converting audio file:", err);
                m.reply("❌ Terjadi kesalahan saat mengkonversi file audio.");
            })
            .run();
    } else {
        console.error("File not found:", audioFile);
        m.reply("❌ File audio tidak ditemukan.");
    }
};

handler.customPrefix = /^(Baka|baka|goblog)$/i;
handler.command = new RegExp();

export default handler;
