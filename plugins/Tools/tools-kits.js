import {
    VoiceAPI
} from '../../lib/tools/kits-ai.js';
const kits = new VoiceAPI();

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    try {
        if (!m.quoted) return m.reply('where\'s message?')
        let q = m.quoted ? m.quoted : m
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
        if (!/audio/.test(mime)) return m.reply(`reply audio/mp3 you want to convert to kits-ai with caption *${usedPrefix + command}* ( index model )`)
        let media = await (await q.download?.())
        if (!media) return m.reply('Can\'t download media')
        await m.reply(wait);
        let list = await kits.getModelData("kits");
        if (!text) {
            let modelsList = list.map((v, index) => `${index + 1}. ${v.label}: ${v.value}`).join("\n\n");
            return m.reply(`Input model number\nAvailable models:\n${modelsList}`);
        }
        let modelNumber = parseInt(text.trim());
        if (isNaN(modelNumber) || modelNumber <= 0 || modelNumber > list.length) {
            return m.reply("Invalid model number. Please choose a number from the available models list.");
        }
        let selectedModel = list[modelNumber - 1];
        let output = await kits.createVoice(selectedModel.value, Buffer.from(media));
        if (output.audioUrl) {
            await conn.sendFile(m.chat, output.audioUrl, '', output.type, m, null, {
                ptt: true,
                waveform: [100, 0, 100, 0, 100, 0, 100]
            });
        } else {
            await m.reply(eror + "\n\n( Tidak ada hasil )")
        }
    } catch (e) {
        console.error("Error:", e);
        await m.reply(eror + "\n\n( Tidak ada hasil )")
    }
};
handler.help = ['kitsvtv <model_number>'];
handler.tags = ['tools'];
handler.command = /^(kitsvtv)$/i;

export default handler;