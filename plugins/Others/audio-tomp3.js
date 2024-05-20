import {
    toAudio
} from '../../lib/converter.js'

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
        if (!/video|audio/.test(mime)) throw `reply video/audio you want to convert to voice note/vn with caption *${usedPrefix + command}*`

        let media = await q.download?.()
        if (!media) throw 'Can\'t download media'

        let audio = await toAudio(media, 'mp4')
        if (!audio.data) throw 'Can\'t convert media to audio'
        
        await conn.sendMessage(m.chat, {
            audio: audio.data,
            mimetype: "audio/mp4"
        }, {
            quoted: m
        });
    } catch (error) {
        console.error(error)
        throw `An error occurred: ${error}`
    }
}
handler.help = ['toaudio']
handler.tags = ['audio']
handler.command = /^to(mp3|a(udio)?)$/i

export default handler