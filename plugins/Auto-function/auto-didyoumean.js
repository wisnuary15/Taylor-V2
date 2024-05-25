import similarity from 'similarity';

export async function before(m, { match }) {
    try {
        if (m.isBaileys || !(m.text || m.caption)) return;

        const usedPrefix = match?.[0]?.[0] || '';
        const text = (m?.text || m?.caption).replace(usedPrefix, '').trim();
        const words = text.split(' ');
        const noPrefix = words[0].toLowerCase();
        const remainingText = words.slice(1).join(' ').toLowerCase();
        const help = Object.values(plugins)
            .flatMap(v => v.help ?? [])
            .map(entry => entry.trim().split(' ')[0].toLowerCase())
            .filter(Boolean);

        const filteredMatches = help.map(target => ({
            target,
            rating: similarity(noPrefix, target)
        })).filter(({ rating }) => rating > 0.70);

        if (filteredMatches.length === 0) return;

        const sortedMatches = filteredMatches.sort((a, b) => b.rating - a.rating);

        const bestMatch = sortedMatches[0];
        const otherMatches = sortedMatches.length > 1 ? sortedMatches.slice(1) : [];

        const bestMatchEntry = {
            header: `Similarity: ${(bestMatch.rating * 100).toFixed(0)}%`,
            id: `${usedPrefix}${bestMatch.target}`,
            title: bestMatch.target,
            description: ""
        };

        const otherMatchEntries = otherMatches.map(item => ({
            header: `Similarity: ${(item.rating * 100).toFixed(0)}%`,
            id: `${usedPrefix}${item.target}`,
            title: item.target,
            description: ""
        }));

        const rows = [
            {
                title: "Best Match",
                highlight_label: "Best match",
                rows: [bestMatchEntry]
            },
            ...(otherMatchEntries.length > 0 ? [{
                title: "Other Matches",
                highlight_label: "Other matches",
                rows: otherMatchEntries
            }] : [])
        ];

        const mentionedJid = m?.mentionedJid?.[0] || (m?.fromMe ? this.user.jid : m?.sender || m?.key.remoteJid);
        const senderName = (m?.name || m?.pushName || m?.sender || "").split('\n')[0];
        const shouldSendMessage = (
            !filteredMatches.some(({ target }) => target === noPrefix) &&
            !m?.isCommand &&
            !help.includes(noPrefix) &&
            !['=>', '>', '$'].some(char => (m?.text || m?.caption).startsWith(char))
        );

        if (!shouldSendMessage) return;

        const caption = `\`\`\`👋 Hai, ${senderName} @${mentionedJid.split('@')[0]}!\`\`\`\n`;

        await this.sendButtonMessages(m.chat, [
            [caption, "Mungkin yang kamu maksud.", null, [], null, null, [["Lihat Disini", rows]]]
        ], m);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

export const disabled = false;
