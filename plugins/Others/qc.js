import {
    sticker
} from '../../lib/sticker.js';
import axios from 'axios';
import {
    Uploader
} from "../../lib/tools/uploader.js";

const upload = new Uploader();

async function Quotly(data) {
    try {
        const response = await axios.post('https://quote.btch.bz/generate', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return Buffer.from(response.data.result.image, 'base64');
    } catch (e) {
        console.error('Quotly Error:', e);
        try {
            const response = await axios.post('https://quotly.netorare.codes/generate', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return Buffer.from(response.data.result.image, 'base64');
        } catch (e) {
            console.error('Quotly Error (Backup):', e);
            return null;
        }
    }
}

const handler = async (m, {
    conn,
    text
}) => {
    try {
        const q = m.quoted || null;
        const mime = q.mimetype || null;
        const allowed = ['image', 'video', 'webp'];
        const download = mime && allowed.includes(mime.split('/')[0]) && await q.download();
        const mediaUrl = download && (await upload.uploadPomf2(download));

        const senderId = parseInt(m.sender.split('@')[0]);
        const senderName = await conn.getName(m.sender);
        const senderPhotoUrl = await conn.profilePictureUrl(m.sender, 'image').catch(() => logo);

        const replyMessage = q ? {
            entities: [],
            avatar: true,
            id: parseInt(q.sender.split('@')[0]),
            name: await conn.getName(q.sender),
            photo: {
                url: await conn.profilePictureUrl(q.sender, 'image').catch(() => logo)
            },
            text: q.text || q.caption || q.description || q.message?.documentMessage?.caption || ''
        } : null;

        const message = {
            entities: [],
            avatar: true,
            from: {
                id: senderId,
                name: senderName,
                photo: {
                    url: senderPhotoUrl
                }
            },
            text: text || q.text || q.caption || q.description || q.message?.documentMessage?.caption || m.text || m.caption || m.message?.documentMessage?.caption || '',
            ...(replyMessage ? {
                replyMessage
            } : {}),
            ...(mediaUrl ? {
                media: {
                    url: `https://wsrv.nl/?url=${mediaUrl}&output=png`
                }
            } : {})
        };

        const json = {
            type: 'quote',
            format: 'png',
            backgroundColor: '#e7ffdd',
            width: 512,
            height: 768,
            scale: 2,
            messages: [message]
        };

        const buffer = await Quotly(json);
        if (!buffer) return m.reply('Error generating quote image.');

        const stickerBuffer = await sticker(buffer, false, senderName, m.sender.split('@')[0]);
        if (!stickerBuffer) return m.reply('Error creating sticker.');

        await conn.sendFile(m.chat, stickerBuffer, 'Quotly.webp', '', m);
    } catch (error) {
        console.error('Handler Error:', error);
    }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc)$/i;

export default handler;