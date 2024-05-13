const handler = async (m, {
    conn
}) => {
    try {
        const stats = Object.entries(global.db.data.stats)
            .map(([key, val]) => ({
                name: Array.isArray(global.plugins[key]?.help) ?
                    global.plugins[key]?.help.join(' , ') : global.plugins[key]?.help || key.split('/').pop().slice(0, -3),
                ...val
            }))
            .filter(({
                name
            }) => !/exec/.test(name))
            .sort((a, b) => b.total - a.total)
            .slice(0, 50)
            .map(({
                name,
                total,
                last,
                success,
                lastSuccess
            }, i) => (
                `*${i + 1}.* ( *${name.split(' ')[0]}* )\n-   *Hits*: \`${total}\`\n-   *Success*: \`${success}\`\n-   *Last Used*: \`${getTime(last)} ago\`\n-   *Last Success*: \`${formatTime(lastSuccess)}\``
            ))
            .join('\n\n');

        conn.reply(m.chat, stats, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan dalam pemrosesan data.', m);
    }
};

handler.command = handler.help = ['totalhit'];
handler.tags = ['info', 'tools'];
export default handler;

const formatTime = (time) => new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    fractionalSecondDigits: 3
}).format(new Date(time));

const getTime = (ms) => {
    const now = parseMs(+new Date() - ms);
    return `${now.days ? now.days + 'd' : ''} ${now.hours ? now.hours + 'h' : ''} ${now.minutes ? now.minutes + 'm' : ''} ${now.seconds ? now.seconds + 's' : ''} ${now.milliseconds ? now.milliseconds + 'ms' : ''}`.trim() || 'a few seconds';
};

const parseMs = (ms) => ({
    days: Math.trunc(ms / 86400000),
    hours: Math.trunc(ms / 3600000) % 24,
    minutes: Math.trunc(ms / 60000) % 60,
    seconds: Math.trunc(ms / 1000) % 60,
    milliseconds: Math.trunc(ms) % 1000
});