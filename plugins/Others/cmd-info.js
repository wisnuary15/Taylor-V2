import fetch from 'node-fetch';
const handler = async (m, {
    conn,
    text
}) => {
    let hash = text;
    if (m.quoted && m.quoted.fileSha256) hash = m.quoted.fileSha256.toString('hex');
    if (!hash) {
        conn.reply(m.chat, '❌ Hash not found', m);
        return;
    }
    let sticker = db.data.sticker[hash];
    if (!sticker) {
        conn.reply(m.chat, '❌ Sticker not in the database', m);
        return;
    }
    // Retrieve creator name and mentioned names in parallel
    const [creatorName, mentionedNames] = await Promise.all([
        await conn.getName(sticker.creator),
        Promise.all(sticker.mentionedJid?.map(async (v) => await conn.getName(v)))
    ]);
    let cmdMentions = sticker.mentionedJid?.map((v, i) => `No. *${i + 1}*:
*Mention Name:* ${mentionedNames[i]} ${v === m.sender ? '👈' : '👤'}
*Mention Number:* ${splitM(v)}
*Mention Jid:* ${v}`).join('\n\n');
    let lockedEmoji = sticker.locked ? '🔒' : '🔓';
    let str = `
📎 *fileSha256:* ${hash}
💬 *Text:* ${sticker.text}
⏰ *Time Create:* ${sticker.at}
${sticker.locked ? '🔐' : '🔓'} *Locked:* ${lockedEmoji}
👤 *Creator Name:* ${creatorName}
☎️ *Creator Number:* ${splitM(sticker.creator)}
🆔 *Creator Jid:* ${sticker.creator}
${sticker.mentionedJid.length > 0 ? `👥 *Cmd Mention:*\n${cmdMentions}` : ''}`.trim();
    conn.reply(m.chat, str, m);
};
handler.help = ['infocmd'];
handler.tags = ['database'];
handler.command = ['infocmd'];
export default handler;
/**
 * split Jid
 * @param {String} jid
 * @returns {String}
 */
function splitM(jid) {
    return jid.split('@')[0];
}
