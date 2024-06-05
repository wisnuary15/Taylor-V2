import {
    addExif
} from '../../lib/sticker.js';
import fetch from "node-fetch";
const commandList = ["bcvn", "bcvid", "bcimg", "bcstick", "bctxt", "bctxt2"];
const mimeAudio = 'audio/mpeg';
const mimeVideo = 'video/mp4';
const mimeImage = 'image/jpeg';
const mimeSticker = 'image/webp';
const generateDoc = (teks, externalAdReply) => ({
    mimetype: mimeAudio,
    fileLength: fsizedoc,
    seconds: fsizedoc,
    ptt: true,
    waveform: [100, 0, 100, 0, 100, 0, 100],
    contextInfo: {
        externalAdReply
    }
});
const handler = async (m, {
    conn,
    command,
    args
}) => {
    let teks
    if (args.length >= 1) {
        teks = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        teks = m.quoted.text
    }
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(1);
    const imgvn = await (await conn.getFile(flaaa.getRandom() + ("Broadcast " + command.slice(2)))).data;
    const externalAdReply = {
        body: "Pesan: " + teks,
        containsAutoReply: true,
        mediaType: 1,
        mediaUrl: sig,
        renderLargerThumbnail: true,
        sourceUrl: null,
        thumbnail: imgvn,
        thumbnailUrl: flaaa.getRandom() + ("Broadcast " + command.slice(2)),
        title: `${htki} BROADCAST ${htka} 📢`
    };
    if (!commandList.includes(command)) {
        throw "❌ Perintah tidak valid!";
    }
    const doc = generateDoc(teks, externalAdReply);
    let groups = Object.entries(conn.chats)?.filter(([_, chat]) => chat.isChats)?.map(v => v[0])?.filter(item => item.endsWith('@g.us'));
    for (let id of groups) {
        if (command === 'bcvn') {
            const audioValue = m.quoted && m.quoted.mtype === "audioMessage" ?
                m.quoted?.download() :
                await generateVoice("id-ID", "id-ID-ArdiNeural", teks);
            if (audioValue) {
                doc.audio = audioValue;
                doc.mimetype = mimeAudio;
                await conn.sendMessage(id, doc, {
                    quoted: null
                });
            }
        } else if (command === 'bcvid') {
            const videoValue = m.quoted && m.quoted.mtype === "videoMessage" ?
                m.quoted?.download() : {
                    url: giflogo
                };
            if (videoValue) {
                doc.video = videoValue;
                doc.mimetype = mimeVideo;
                doc.caption = teks;
                await conn.sendMessage(id, doc, {
                    quoted: null
                });
            }
        } else if (command === 'bcimg') {
            const imageValue = m.quoted && m.quoted.mtype === "imageMessage" ?
                m.quoted?.download() : {
                    url: logo
                };
            if (imageValue) {
                doc.image = imageValue;
                doc.mimetype = mimeImage;
                doc.caption = teks;
                await conn.sendMessage(id, doc, {
                    quoted: null
                });
            }
        } else if (command === 'bcstick') {
            const stickerValue = m.quoted && m.quoted.mtype === "stickerMessage" ?
                await m.quoted?.download() :
                await (await conn.getFile(flaaa.getRandom() + ("Broadcast " + command.slice(2)))).data;
            if (stickerValue) {
                const imgvn = await (await conn.getFile(flaaa.getRandom() + ("Broadcast " + command.slice(2)))).data;
                const stiker = await addExif(stickerValue, packname, m.name);
                conn.sendFile(id, stiker, 'sticker.webp', '', null, null, {
                    fileLength: fsizedoc,
                    mimetype: mimeSticker,
                    contextInfo: {
                        externalAdReply
                    }
                });
            }
        } else if (command === 'bctxt') {
            const textValue = m.quoted && m.quoted.mtype === "extendedTextMessage" ?
                m.quoted.text :
                teks;
            if (textValue) {
                doc.text = readMore;
                doc.contextInfo.externalAdReply.body = textValue;
                doc.contextInfo.externalAdReply.thumbnailUrl = flaaa.getRandom() + (textValue);
                await conn.sendMessage(id, doc, {
                    quoted: null
                });
            }
        } else if (command === 'bctxt2') {
            const textValue2 = m.quoted && m.quoted.mtype === "extendedTextMessage" ?
                m.quoted.text :
                teks;
            if (textValue2) {
                doc.text = textValue2;
                doc.contextInfo.externalAdReply.body = author;
                await conn.sendMessage(id, doc, {
                    quoted: null
                });
            }
        }
    }
};
handler.help = commandList;
handler.tags = ["main"];
handler.command = new RegExp(`^(${commandList.join('|')})$`, 'i');
export default handler;
async function generateVoice(Locale = "id-ID", Voice = "id-ID-ArdiNeural", Query) {
    const formData = new FormData();
    formData.append("locale", Locale);
    formData.append("content", `<voice name="${Voice}">${Query}</voice>`);
    formData.append("ip", '46.161.194.33');
    const response = await fetch('https://app.micmonster.com/restapi/create', {
        method: 'POST',
        body: formData
    });
    return Buffer.from(('data:audio/mpeg;base64,' + await response.text()).split(',')[1], 'base64');
};
