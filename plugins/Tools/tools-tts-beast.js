import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    try {
        if (!text) throw `Masukkan input. Contoh penggunaan: ${usedPrefix + command} en Halo dunia`;
        let res = await tts(text);
        if (res) {
            await conn.sendFile(m.chat, res.audio, '', '', m, null, {
                ptt: true,
                waveform: [100, 0, 100, 0, 100, 0, 100],
                contextInfo: adReplyS.contextInfo
            });
        }
    } catch (e) {
        m.reply(`${e}`);
        console.error('An error occurred:', e);
    }

}
handler.help = ['beast <teks>']
handler.tags = ['tools']
handler.command = /^(beast)$/i

export default handler

async function tts(query) {
    try {
        let tts = await fetch('https://www.api.vyturex.com/beast?query=' + encodeURIComponent(query));
        return await tts.json();
    } catch (e) {
        throw e;
    }
}