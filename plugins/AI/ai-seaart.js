import fetch from 'node-fetch';
const pagePre = 40;
const apiUrl = 'https://www.seaart.ai/api/v1/artwork/list';
const fetchData = async (requestData) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const {
            data
        } = await response.json();
        const items = data.items;
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error('No items found.');
        }
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    m.reply(wait)
    const requestData = {
        page: 1,
        page_size: pagePre,
        order_by: 'new',
        type: 'community',
        keyword: text,
        tags: []
    };
    try {
        const result = await fetchData(requestData);
        await conn.sendMessage(m.chat, {
            image: {
                url: result.banner.url
            },
            caption: `Prompt: ${result.prompt}\nModel id: ${result.model_id}\nAuthor: ${result.author.name}`,
            mentions: [m.sender]
        }, {
            quoted: m
        });
    } catch (error) {
        console.error('Error in example usage:', error);
        m.reply(eror);
    }
}
handler.help = ["seaart"]
handler.tags = ["ai"]
handler.command = /^(seaart)$/i
export default handler
