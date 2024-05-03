export async function before(m) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.gg|fb\.watch)\/[^\s/]+(?:\/videos\/\d+\/?)?/;
    const matches = m.text.trim().match(regex);
    const chat = global.db.data.chats[m.chat];
    const spas = "                ";

    if (!matches || !matches[0] || chat.autodlFacebook !== true) return;

    await m.reply(wait);

    try {
        const {
            video
        } = await fbdl(matches[0]);
        const FbCap = `${spas}*[ FACEBOOK ]*`;
        await conn.sendFile(m.chat, video || giflogo, "", FbCap, m);
    } catch (e) {
        try {
            const {
                facebook
            } = await get(matches[0]);
            const FbCap2 = `${spas}*[ FACEBOOK ]*`;
            await conn.sendFile(m.chat, facebook || giflogo, "", FbCap2, m);
        } catch (e) {}
    }
}

export const disabled = false;