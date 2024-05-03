let handler = async (m, {
    conn
}) => {
    try {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        const diceImage = rollDice(diceValue);
        const isHighRoll = diceValue >= 4;
        const additionalCoins = diceValue === 3 ? 300 : diceValue * 100;
        const baseCoins = isHighRoll ? Math.min(Math.floor(Math.random() * 15001), 15000) : 0;
        const baseExp = isHighRoll ? Math.min(Math.floor(Math.random() * 10001), 10000) : 0;
        const multiplier = isHighRoll ? Math.floor(Math.random() * 2) + 1 : 1;
        const coins = Math.min(baseCoins * multiplier + additionalCoins, 15000);
        const exp = Math.min(baseExp * multiplier, 10000);
        const player = global.db.data.users[m.sender];
        player.money += coins;
        player.exp += exp;

        const coinMessage = coins ? `💰 *${coins.toLocaleString()}* coins earned!` : 'No coins earned.';
        const expMessage = exp ? `🌟 *${exp.toLocaleString()}* exp gained!` : 'No exp gained.';
        const additionalCoinsMessage = additionalCoins ? `💰 Additional *${additionalCoins.toLocaleString()}* coins for rolling a ${diceValue}!` : '';
        const multiplierMessage = multiplier > 1 ? `Multiplier: *${multiplier}*` : '';

        const msg = `${coinMessage}\n${expMessage}\n${additionalCoinsMessage}\n${multiplierMessage}`;
        await conn.reply(m.chat, msg, m, {
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "🎲 Roll the dice!",
                    thumbnail: await (await conn.getFile(diceImage)).data
                },
            },
        });
    } catch (error) {
        console.error(error);
        await m.reply("Error processing the dice roll.");
    }
};

handler.help = ["dadu"];
handler.tags = ["game"];
handler.command = ["dadu"];
export default handler;

function rollDice(value) {
    return `https://www.random.org/dice/dice${value}.png`;
}