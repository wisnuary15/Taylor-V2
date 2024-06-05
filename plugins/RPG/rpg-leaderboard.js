import {
    areJidsSameUser
} from '@whiskeysockets/baileys';
const leaderboards = [
    'level', 'exp', 'limit', 'money', 'iron', 'gold', 'diamond', 'emerald', 'trash',
    'potion', 'petFood', 'wood', 'rock', 'string', 'common', 'uncommon', 'mythic',
    'legendary', 'pet'
];
const handler = async (m, {
    conn,
    args,
    participants,
    usedPrefix,
    command
}) => {
    let imgr = flaaa.getRandom();
    let users = Object.entries(db.data.users)?.map(([key, value]) => ({
        ...value,
        jid: key
    }));
    let leaderboard = leaderboards?.filter(v => v && users.some(user => user && user[v]));
    let type = (args[0] || '').toLowerCase();
    const wrong = `🔖 ᴛʏᴩᴇ ʟɪsᴛ :
${leaderboard?.map(v => `⮕ ${rpg.emoticon(v)} - ${v}`).join('\n')}
––––––––––––––––––––––––
💁🏻‍♂ ᴛɪᴩ :
⮕ ᴛᴏ ᴠɪᴇᴡ ᴅɪғғᴇʀᴇɴᴛ ʟᴇᴀᴅᴇʀʙᴏᴀʀᴅ:
${usedPrefix}${command} [type]
★ ᴇxᴀᴍᴩʟᴇ:
${usedPrefix}${command} legendary`.trim();
    if (!leaderboard.includes(type)) {
        return conn.sendFile(m.chat, imgr + 'leaderboard', '', '*––––『 LEADERBOARD 』––––*\n' + wrong, m);
    }
    let sortedItem = users?.map(toNumber(type)).sort(sort(type, false));
    let userItem = sortedItem?.map(enumGetKey);
    let userIndex = userItem.indexOf(m.sender);
    let userEntries = await Promise.all(
        sortedItem?.slice(0, 5).map(async (user, i) => {
            let isParticipant = participants.some(p => areJidsSameUser(user.jid, p.id));
            let name = isParticipant ? await conn.getName(user.jid) : 'Unknown';
            return `${i + 1}. *﹙${user[type]}﹚* - ${isParticipant ? `${name} \nwa.me/` : 'ғʀᴏᴍ ᴏᴛʜᴇʀ ɢʀᴏᴜᴩ\n @'}${user.jid.split('@')[0]}`;
        })
    );
    let text = `
🏆 ʀᴀɴᴋ: ${userIndex + 1} ᴏᴜᴛ ᴏғ ${userItem.length}

                    *• ${rpg.emoticon(type)} ${type} •*

${userEntries.join('\n\n')}
`.trim();
    return conn.sendFile(m.chat, imgr + 'leaderboard', '', `*–『 GLOBAL LEADERBOARD 』–*\n` + text, m, {
        mentions: userItem.slice(0, 5)?.filter(v => !participants.some(p => areJidsSameUser(v, p.id)))
    });
};
handler.help = ['leaderboard [jumlah user]', 'lb [jumlah user]'];
handler.tags = ['xp'];
handler.command = /^(leaderboard|lb)$/i;
export default handler;

function sort(property, ascending = true) {
    return (a, b) => ascending ? a[property] - b[property] : b[property] - a[property];
}

function toNumber(property, _default = 0) {
    return (user) => ({
        ...user,
        [property]: user[property] === undefined ? _default : user[property]
    });
}

function enumGetKey(user) {
    return user.jid;
}

function isNumber(number) {
    return !isNaN(parseInt(number));
}
