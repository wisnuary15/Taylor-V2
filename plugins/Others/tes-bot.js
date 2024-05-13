import os from 'os';
import {
    sizeFormatter
} from 'human-readable'
const format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    standard: 'KMGTPEZY'
});
const handler = async (m, {
    conn
}) => {
    try {
        const start = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const end = Date.now();
        const responseTime = (end - start) / 1000;

        const thumbnail = await conn.getFile("https://cdn-icons-png.flaticon.com/128/1533/1533913.png");

        const osInfo = `🖥️ *OS*: ${os.type()} ${os.release()}\n💻 *CPU*: ${os.cpus()[0].model}\n🧠 *Memory*: ${format(os.totalmem())}`;
        const responseMessage = `⏰ *Response Time*: ${responseTime.toFixed(2)}s\n\n${osInfo}`;

        await conn.sendMessage(m.chat, {
            text: responseMessage,
            contextInfo: {
                externalAdReply: {
                    title: "🤖 Bot is active",
                    thumbnail: thumbnail.data,
                },
                mentionedJid: [m.sender],
            },
        }, {
            quoted: m
        });

    } catch (error) {
        console.error("Error in handler:", error);
    }
};

handler.customPrefix = /^([Tt]es[st]?)$/i;
handler.command = new RegExp;
export default handler;