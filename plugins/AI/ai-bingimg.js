const {
    BingImageCreator
} = await (await import('../../lib/ai/bing-image.js'));
import fetch from 'node-fetch';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    m.reply(wait);
    try {
        const res = new BingImageCreator({
            cookie: "1C-k_4JiXEAt_V-jpEJFkOYMDXVkzPuzH-xRminmulnHrfWEivRKtX9wsEWwWe_WcO8qtX4gR2RVrcvkvX5q3CnhBa3LmBrPRDAo25VzUvrwBrMp9cAuEU86uzrOKpwfpqR92PndHglCOPiv_BBm_0v72KC7jqD1VR9XDDqKNE-Eph-QrqN0hw5h88lz654xjE5XzFHtV4PsahiDnRwNkaw"
        });
        const data = await res.createImage(text);
        const filteredData = data?.filter(file => !file.endsWith('.svg'));
        const totalCount = filteredData.length;
        if (totalCount > 0) {
            for (let i = 0; i < totalCount; i++) {
                try {
                    conn.sendFile(
                        m.chat,
                        filteredData[i],
                        '',
                        `Image *(${i + 1}/${totalCount})*`,
                        m,
                        false, {
                            mentions: [m.sender],
                        }
                    );
                } catch (error) {
                    console.error(`Error sending file: ${error.message}`);
                    m.reply(`Failed to send image *(${i + 1}/${totalCount})*`);
                }
            }
        } else {
            m.reply('No images found after filtering.');
        }
    } catch (error) {
        try {
            const data = await AemtBingImg(text);
            try {
                conn.sendFile(
                    m.chat,
                    data.result,
                    '',
                    `Image`,
                    m,
                    false, {
                        mentions: [m.sender],
                    }
                );
            } catch (error) {
                console.error(`Error sending file: ${error.message}`);
                m.reply(`Failed to send image`);
            }
        } catch (error) {
            console.error(`Error in handler: ${error.message}`);
            m.reply('An error occurred while processing the request.');
        }
    }
};
handler.help = ["bingimg *[query]*"];
handler.tags = ["ai"];
handler.command = /^(bingimg)$/i;
export default handler;
async function AemtBingImg(query) {
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    const bardRes = await fetch(`https://aemt.me/bingimg?text=${query}`, {
        method: "get",
        headers
    });
    const bardText = await bardRes.json();
    return bardText;
};
