import similarity from 'similarity';

export async function before(m, {
    match
}) {
    if (m.isBaileys || !(m.text || m.caption)) return;

    const usedPrefix = match?.[0]?.[0] || '';
    const noPrefix = (m?.text || m?.caption).replace(usedPrefix, '').trim().split(' ')[0].toLowerCase();
    const help = Object.values(plugins).flatMap(v => v.help ?? []).map(entry => entry.trim().split(' ')[0].toLowerCase()).filter(Boolean);
    const filteredMatches = help.map(target => ({
        target,
        rating: similarity(noPrefix, target)
    })).filter(({
        rating
    }) => rating > 0.75);

    const groupedMatches = {};
    filteredMatches.forEach(item => {
        const score = (item.rating * 100).toFixed(0);
        if (!groupedMatches[score]) groupedMatches[score] = [];
        if (groupedMatches[score].length < 5) groupedMatches[score].push(item.target);
    });

    const resultText = Object.entries(groupedMatches)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([score, targets]) => {
            const similarityPercentage = `*Similarity:* \`${score}%\``;
            const targetList = targets.sort().map(target => `> ${usedPrefix + target}`).join('\n');
            return `${similarityPercentage}\n${targetList}`;
        })
        .join('\n\n');

    const mentionedJid = m?.mentionedJid?.[0] || (m?.fromMe ? this.user.jid : m?.sender || m?.key.remoteJid);
    const senderName = (m?.name || m?.pushName || m?.sender).split('\n')[0];
    const shouldSendMessage = (Object.keys(groupedMatches).length > 0 && !filteredMatches.some(({
        target
    }) => target === noPrefix) && !m?.isCommand && !help.includes(noPrefix) && !['=>', '>', '$'].some(char => (m?.text || m?.caption).startsWith(char)));

    if (!shouldSendMessage) return;

    await this.sendMessage(m?.chat, {
        text: `\`\`\`👋 Hy ${senderName} @${mentionedJid.split('@')[0]} !\nMungkin yang kamu maksud:\`\`\`\n\n${resultText}`,
        mentions: [mentionedJid]
    }, {
        quoted: m
    });
}

export const disabled = false;