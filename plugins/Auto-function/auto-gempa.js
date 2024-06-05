import fetch from 'node-fetch';
export async function before(m) {
    const chat = db.data.chats[m.chat];
    if (m.isBaileys || !m.text || !chat.autoGempa) return false;
    try {
        const link = "https://data.bmkg.go.id/DataMKG/TEWS/";
        this.autoGempa = this.autoGempa || {};
        if (Object.keys(this.autoGempa).length === 0) {
            const response = await fetch(link + "autogempa.json");
            const {
                gempa
            } = (await response.json()).Infogempa;
            this.autoGempa.data = gempa;
            this.autoGempa.state = true;
        }
        setInterval(async () => {
            try {
                const response = await fetch(link + "autogempa.json");
                const {
                    gempa: newEarthquakeData
                } = (await response.json()).Infogempa;
                if (JSON.stringify(newEarthquakeData) !== JSON.stringify(this.autoGempa.data)) {
                    this.autoGempa.state = false;
                    if (!this.autoGempa.state) {
                        this.autoGempa.data = newEarthquakeData;
                        const formattedDate = new Date(newEarthquakeData.Tanggal).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        });
                        const formattedTime = new Date(newEarthquakeData.DateTime).toLocaleTimeString('en-US', {
                            hour12: false
                        });
                        const txt = `*Broadcast Gempa Terkini 🌐*\n\n📅 *Tanggal:* ${formattedDate}\n⌚ *Waktu:* ${formattedTime} WIB\n📍 *Koordinat:* ${newEarthquakeData.Coordinates}\n⛰️ *Magnitudo:* ${newEarthquakeData.Magnitude}\n🕳️ *Kedalaman:* ${newEarthquakeData['Kedalaman']} km\n🚩 *Lokasi:* ${newEarthquakeData.Wilayah}\n🌊 *Potensi:* ${newEarthquakeData.Potensi}\n💡 *Effect:* ${newEarthquakeData.Dirasakan}`;
                        const msg = {
                            contextInfo: {
                                externalAdReply: {
                                    title: "🌍 Info Gempa Terkini 🌋",
                                    body: newEarthquakeData.Potensi,
                                    renderLargerThumbnail: true,
                                    mediaUrl: "",
                                    mediaType: 1,
                                    thumbnail: await this.resize(link + newEarthquakeData.Shakemap, 300, 150),
                                    sourceUrl: ""
                                }
                            }
                        };
                        this.reply(m.chat, txt.replaceAll("%p", "```"), null, msg);
                        this.autoGempa.state = true;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }, 15 * 60 * 1000);
    } catch (error) {
        console.error(error);
    }
}
