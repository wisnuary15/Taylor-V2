import fetch from 'node-fetch';

export async function before(m) {
    const regex = /(https?:\/\/(?:www\.)?instagram\.[a-z\.]{2,6}\/[\w\-\.]+(\/[^\s]*)?)/g;
    const matches = m.text.trim().match(regex);
    const chat = global.db.data.chats[m.chat];
    const spas = "                ";

    if (!matches || !matches[0] || chat.autodlInstagram !== true) return;

    await m.reply(wait);

    try {
        const res = await fetch(`https://vihangayt.me/download/instagram?url=${matches[0]}`);
        const igeh = await res.json();
        const IgCap = `${spas}*[ INSTAGRAM ]*`;

        if (igeh.data && igeh.data.data.length > 0) {
            for (const item of igeh.data.data) {
                await conn.sendFile(m.chat, item.url || giflogo, "", IgCap, m);
            }
        }
    } catch (e) {}
}

export const disabled = false;