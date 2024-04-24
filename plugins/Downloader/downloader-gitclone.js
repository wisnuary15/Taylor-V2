import fetch from 'node-fetch';
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

let handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    try {
        if (!args[0]) throw `Example user ${usedPrefix}${command} <url>`;
        if (!regex.test(args[0])) throw 'Link salah!';
        let [_, user, repo] = args[0].match(regex) || [];
        repo = repo.replace(/.git$/, '');
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`;
        await m.reply(wait);
        let response = await fetch(url, {
            method: 'HEAD'
        });
        let filename = response.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1];
        await conn.sendFile(m.chat, url, filename, null, m);
    } catch (error) {
        console.error('Error:', error.message);
        m.reply(`Error: ${error.message}`);
    }
};
handler.help = ['gitclone'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^gitclone$/i;
handler.limit = true;

export default handler;