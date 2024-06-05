import fetch from 'node-fetch';
const handler = async (m, {
    text
}) => {
    try {
        if (!text) throw 'Cari apa?';
        let res = await fetch(API('https://api.github.com', '/search/repositories', {
            q: text
        }));
        let json = await res.json();
        if (res.status !== 200) throw json;
        let str = json.items?.map((repo, index) => `
${1 + index}. *${repo.full_name}*${repo.fork ? ' (fork)' : ''}
_${repo.html_url}_
_Dibuat pada *${formatDate(repo.created_at)}*_
_Terakhir update pada *${formatDate(repo.updated_at)}*_
👁  ${repo.watchers}   🍴  ${repo.forks}   ⭐  ${repo.stargazers_count}
${repo.open_issues} Issue${repo.description ? `
*Deskripsi:*\n${repo.description}` : ''}
*Clone:* \`\`\`$ git clone ${repo.clone_url}\`\`\`
`.trim()).join('\n\n');
        m.reply(str);
    } catch (error) {
        console.error('Error:', error);
        m.reply('Terjadi kesalahan saat mencari repository GitHub.');
    }
};
handler.help = ['githubs'];
handler.tags = ['tools'];
handler.command = /^(ghs|githubs)$/i;
export default handler;

function formatDate(n, locale = 'id') {
    let d = new Date(n);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
}
