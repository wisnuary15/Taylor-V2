import {
    listVoices,
    synthesize
} from '../../lib/tools/elevenlabs.js';

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    const input_data = await listVoices();

    let [urutan, tema] = text.split("|")
    if (!tema) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]")

    await m.reply(wait)
    try {
        let data = input_data.voices
        if (!urutan) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"))
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"))
        if (urutan > data.length) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"))
        let out = data[urutan - 1].voice_id

        const res = await synthesize({
            model_id: 'e1',
            output_format: 'mp3_44100_128',
            voice_id: out,
            text: tema
        })

        if (res) {
            await conn.sendFile(m.chat, res, '', '', m, null, {
                ptt: true,
                waveform: [100, 0, 100, 0, 100, 0, 100],
                contextInfo: adReplyS.contextInfo
            });
        } else {
            console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
        }
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["elevenlabs *[nomor]|[query]*"]
handler.tags = ["ai"]
handler.command = /^(elevenlabs)$/i
export default handler