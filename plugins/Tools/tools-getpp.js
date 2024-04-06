const handler = async (m, {
    text,
    conn
}) => {
    try {
        const whoArr = [
            ...(m.quoted ? [m.quoted.sender || m.quoted.key?.remoteJid || m.quoted.vM?.key?.remoteJid] : []),
            ...(text || m.quoted.text || m.text ? await conn.parseMention(text || m.quoted.text || m.text) : []),
            ...(m.mentionedJid?.[0] ? [m.mentionedJid[0]] : []),
            ...(!(m.quoted || text || m.mentionedJid) && (m.sender || m.chat || m.key?.remoteJid) ? [m.sender || m.chat || m.key?.remoteJid] : [])
        ];

        const validNumbers = whoArr.map(phone => (phone.match(/\d+/g) || []).join('')).filter(phone => phone.length >= 10 && phone.length <= 15 && parseInt(phone, 10) >= 1000000000 && parseInt(phone, 10) <= 999999999999999);

        const totalNumbers = validNumbers.length;
        if (totalNumbers > 0) await conn.reply(m.chat, `📊 *Total Number*: *${totalNumbers}*\n\n${validNumbers.map((number, index) => `*${index + 1}.* @${number}⁩`).join('\n')}`, m, {
            mentions: validNumbers.map((v) => v + 's.whatsapp.net')
        });
        else await conn.reply(m.chat, 'Tidak ada nomor yang valid ditemukan.', m);

        for (const who of validNumbers.slice(0, 5)) {
            const data = await conn.onWhatsApp(who);
            for (const item of data.filter(item => item.exists)) {
                const profileJid = item.jid;
                try {
                    const response = await conn.profilePictureUrl(profileJid, 'image');
                    await conn.sendFile(m.chat, response, 'profile.jpg', `Profile: @${profileJid.split('@')[0]}`, m, null, {
                        mentions: [profileJid]
                    });
                } catch (error) {
                    console.error(`Error processing profile picture for ${profileJid}`, error);
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

handler.command = /^(get(pp|profile))$/i;
handler.help = ['getprofile [@users]'];
handler.tags = ['tools'];
handler.group = true;

export default handler;