const rewards = {
    exp: 9999,
    money: 4999,
    potion: 5,
    iron: 2,
    legendary: 1,
    emas: 2,
    string: 3,
    limit: 1,
};
const cooldown = 3600000;
const handler = async (m, {
    conn,
    usedPrefix
}) => {
    const user = db.data.users[m.sender];
    if (new Date() - user.lasthourly < cooldown) {
        const remainingTime = new Date(user.lasthourly + cooldown - new Date());
        throw `You have already claimed this hourly claim! Wait for *${remainingTime.toTimeString()}*`;
    }
    let text = '';
    for (const reward of Object.keys(rewards)) {
        if (!(reward in user)) continue;
        user[reward] += rewards[reward];
        text += `*+${rewards[reward]}* ${rpg.emoticon(reward)}${reward}\n`;
    }
    conn.sendButton(m.chat, `${htki} HOURLY ${htka}\n`, text.trim(), flaaa.getRandom() + "Hourly", [
        ["Daily", usedPrefix + "daily"]
    ], m);
    user.lasthourly = new Date() * 1;
};
handler.help = ['hourly'];
handler.tags = ['xp'];
handler.command = /^(hourly)$/i;
handler.cooldown = cooldown;
export default handler;
