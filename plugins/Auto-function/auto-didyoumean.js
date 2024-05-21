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

        const groupedMatches = {};
        filteredMatches.forEach(item => {
            const score = (item.rating * 100).toFixed(0);
            if (!groupedMatches[score]) groupedMatches[score] = [];
            if (groupedMatches[score].length < 5) groupedMatches[score].push(item.target);
        });

        const groupedResults = Object.entries(groupedMatches).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

        const [bestScore, bestTargets] = groupedResults[0] || [0, []];
        const bestMatches = bestTargets.sort().map(target => ({
            header: `Similarity: ${bestScore}%`,
            id: `${usedPrefix}${target}`,
            title: target,
            description: ""
        }));

        const allMatches = groupedResults.slice(1).flatMap(([score, targets]) => 
            targets.sort().map(target => ({
                header: `Similarity: ${score}%`,
                id: `${usedPrefix}${target}`,
                title: target,
                description: ""
            }))
        );

        if (bestMatches.length === 0 && allMatches.length === 0) return;

        const rows = bestMatches.length === 1 ? [{
            title: "Best Match",
            highlight_label: "Best match",
            rows: bestMatches
        }] : [{
            title: "Best Matches",
            highlight_label: "Best match",
            rows: bestMatches
        }, {
            title: "All Matches",
            highlight_label: "Other matches",
            rows: allMatches
        }];

        const mentionedJid = m?.mentionedJid?.[0] || (m?.fromMe ? this.user.jid : m?.sender || m?.key.remoteJid);
        const senderName = (m?.name || m?.pushName || m?.sender || "").split('\n')[0];
        const shouldSendMessage = (
            Object.keys(groupedMatches).length > 0 && 
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
