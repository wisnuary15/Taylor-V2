import gtts from 'node-gtts'
import {
    readFileSync,
    unlinkSync
} from 'fs'
import {
    join
} from 'path'
import fetch from 'node-fetch'
let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom());
    let name = await conn.getName(who);

    let lang, text
    if (args.length >= 2) {
        lang = args[0] ? args[0] : "id", text = args.slice(1).join(" ")
    } else if (m.quoted && m.quoted.text) {
        lang = args[0] ? args[0] : "id", text = m.quoted.text
    } else throw `Ex: ${usedPrefix + command} id hello i am robot`

    try {
        if (!text) throw `Masukkan input. Contoh penggunaan: ${usedPrefix}${command} en Halo dunia`;

        let res = await tts(text, lang);

        if (res) {
            await conn.sendFile(m.chat, res, 'audio.mp3', '', m, true, {
            mimetype: 'audio/mp4',
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
handler.help = ['tts <lang> <teks>']
handler.tags = ['tools']
handler.command = /^(gtts|tts)$/i

export default handler

function tts(text, lang = 'id') {
    console.log(lang, text)
    return new Promise((resolve, reject) => {
        try {
            let tts = gtts(lang)
            let filePath = join(global.__dirname(import.meta.url), '../../tmp', (1 * new Date) + '.wav')
            tts.save(filePath, text, () => {
                resolve(readFileSync(filePath))
                unlinkSync(filePath)
            })
        } catch (e) {
            reject(e)
        }
    })
}