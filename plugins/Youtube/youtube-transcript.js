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
    text
}) => {
    const quot = m.quoted ? m.quoted : m;
    const q = text ? text : quot.text;
    const regex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/;
    const matches = q.trim().match(regex);

    if (!matches || !matches[0]) {
        console.error("Invalid YouTube URL");
        return;
    }

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