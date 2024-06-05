const handler = async (m, {
    conn
}) => {
    try {
        const groupId = m.chat;
        const listbot = [{
                number: conn.user.jid,
                name: conn.user.name,
                groupId
            },
            ...(conn.user.listbot[groupId] || [])
        ]?.filter(bot => bot.groupId === groupId);
        const totalBots = listbot.length;
        const formattedText = listbot?.map(({
            number,
            name
        }, index) => `*${index + 1}.* @${number.split('@')[0]} - ${name}`).join('\n');
        m.reply(
            `📊 *Total Bot*: *${totalBots}* pesan dari *${totalBots}* bot\n\n${formattedText}`,
            null, {
                contextInfo: {
                    mentionedJid: listbot?.map(({
                        number
                    }) => number)
                }
            }
        );
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Terjadi kesalahan.', m);
    }
};
handler.help = ['listbot'];
handler.tags = ['listbot'];
handler.command = /^(listbot|bots)$/i;
handler.group = true;
export default handler;
