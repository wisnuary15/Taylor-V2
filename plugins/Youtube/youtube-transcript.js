import axios from 'axios';

const apiInstance = axios.create({
    baseURL: "https://api.kome.ai",
    headers: {
        "Content-Type": "application/json",
        "Referer": "https://api.kome.ai"
    }
});

const youtubeTranscript = async (videoId) => {
    try {
        const response = await apiInstance.post("/api/tools/youtube-transcripts", {
            video_id: videoId,
            format: true
        });

        if (response.data.transcript === undefined) {
            throw new Error("Transcript not found");
        }

        return response.data.transcript;
    } catch (error) {
        console.error("Error in youtubeTranscript:", error);
    }
};

const handler = async (m, {
    conn,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    const regex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/;
    const matches = text.trim().match(regex);

    if (!matches || !matches[0]) return m.reply("Invalid YouTube URL");

    try {
        const transcribe = await youtubeTranscript(matches[0]);
        await m.reply(transcribe);
    } catch (error) {
        console.error("Error in handler:", error);
    }
};

handler.help = ['transkripyt'];
handler.tags = ['tools'];
handler.command = /^(transcriptsyt|transcriptsyoutube|transkripyt|transkripyoutube)$/i;
export default handler;