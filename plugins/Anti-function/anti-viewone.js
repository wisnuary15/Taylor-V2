import {
    downloadContentFromMessage
} from '@whiskeysockets/baileys';
export async function before(m) {
    const {
        viewonce
    } = db.data.chats[m.chat];
    if (!viewonce || !m.mtype || !m.msg || !m.msg.hasOwnProperty('viewOnce')) return;
    try {
        const type = m.msg.mimetype.split('/')[0];
        const media = await downloadContentFromMessage(m.msg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        const fileSize = formatFileSize(m.msg.fileLength);
        const timestamp = getMakassarTimestamp(m.msg.mediaKeyTimestamp);
        const description = `🚫 *Anti-ViewOnce*\n📁 *Media Type:* ${type === 'image' ? 'Image' : type === 'video' ? 'Video' : type === 'audio' ? 'Audio' : 'Unknown'}\n📝 *Caption:* ${m.msg.caption || 'N/A'}\n📏 *Size:* ${fileSize}\n⏰ *Timestamp:* ${timestamp}\n👤 *Sender:* @${m.sender.split('@')[0]}`;
        if (/image|video|audio/.test(type)) {
            this.sendFile(m.chat, buffer, type, description || type, m, false, {
                mentions: [m.sender]
            });
            console.log(`[📷 View Once ${type}] Detected`);
        }
    } catch (error) {
        console.error('Error processing media:', error);
    }
}

function formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'TY', 'EY'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(100 * (bytes / Math.pow(1024, i))) / 100 + ' ' + sizes[i];
}

function getMakassarTimestamp(timestamp) {
    const makassarTimestamp = new Date(timestamp * 1000).toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta'
    });
    return makassarTimestamp;
}
