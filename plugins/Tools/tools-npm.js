import fetch from 'node-fetch';

const handler = async (m, {
    command,
    text
}) => {
    try {
        const urls = {
            npmjs: `https://registry.npmjs.org/-/v1/search?text=${text}`,
            cdnjs: `https://api.cdnjs.com/libraries/${text}`,
            jsdelivr: `https://registry.jsdelivr.net/v1/search?query=${text}`,
            unpkg: `https://unpkg.com/${text}/?meta`,
            jsdelivrcdn: `https://cdn.jsdelivr.net/npm/${text}`,
            cloudflare: `https://api.cdnjs.com/libraries/${text}`,
            rawgit: `https://api.github.com/repos/${text}/releases`,
            bootstrapcdn: `https://api.cdnjs.com/libraries/${text}`,
            googleapis: `https://ajax.googleapis.com/ajax/libs/${text}`,
            jquerycdn: `https://code.jquery.com/${text}`,
            fontawesome: `https://api.cdnjs.com/libraries/${text}`,
            fontcdn: `https://fonts.googleapis.com/css?family=${text.replace(/\s/g, '+')}`,
        };

        const url = urls[command];

        if (!url) return m.reply('Perintah tidak dikenali.');

        const res = await fetch(url);
        const data = await res.json();

        let txt;

        switch (command) {
            case 'npmjs':
                const responseData = data.objects;
                if (!responseData.length) return m.reply(`Query "${text}" tidak ditemukan :/`);

                txt = responseData.map(({
                    package: pkg
                }) => (
                    `📦 *${pkg.name}* (v${pkg.version})\n[🔗 npm](${pkg.links.npm})\n${pkg.description}`
                )).join('\n\n');
                break;

            case 'cdnjs':
                txt = `📦 *Name:* ${data.name}\n*Latest:* ${data.version}\n\n*Description:* ${data.description}\n*Homepage:* ${data.homepage}`;
                break;

            case 'jsdelivr':
                txt = data.results.map((pkg) => (
                    `📦 *Name:* ${pkg.package.name}\n*Version:* ${pkg.package.version}\n*Description:* ${pkg.package.description}\n*Homepage:* ${pkg.package.links.homepage}`
                )).join('\n\n');
                break;

            case 'unpkg':
                txt = `📦 *Package:* ${data.name}\n*Version:* ${data.version}\n*Description:* ${data.description}\n*Homepage:* ${data.homepage}`;
                break;

            case 'jsdelivrcdn':
                txt = `📦 *CDN:* ${data.name}\n*URL:* ${data.latest}`;
                break;

            case 'cloudflare':
                txt = `📦 *Library:* ${data.name}\n*Version:* ${data.version}\n*Homepage:* ${data.homepage}`;
                break;

            case 'rawgit':
                txt = data.map((release) => (
                    `📦 *Version:* ${release.tag_name}\n[🔗 Release](${release.html_url})`
                )).join('\n\n');
                break;

            case 'bootstrapcdn':
                txt = `📦 *Library:* ${data.name}\n*Version:* ${data.version}\n*Description:* ${data.description}`;
                break;

            case 'googleapis':
            case 'jquerycdn':
                txt = `📦 *Library:* ${data.name}\n*Version:* ${data.version}\n*URL:* ${data.latest}`;
                break;

            case 'fontawesome':
                txt = data.versions.map((pkg) => (
                    `📦 *Name:* ${pkg.name}\n*Version:* ${pkg.version}\n*Homepage:* ${pkg.homepage}`
                )).join('\n\n');
                break;

            case 'fontcdn':
                txt = `📦 *Font:* ${data.family}\n*URL:* ${url}`;
                break;

            default:
                txt = `Perintah "${command}" belum diimplementasikan.`;
                break;
        }

        m.reply(txt);
    } catch (error) {
        m.reply(error.message);
    }
};

handler.help = ['npmsearch'];
handler.tags = ['tools'];
handler.command = /^(npmjs|cdnjs|jsdelivr|unpkg|jsdelivrcdn|cloudflare|rawgit|bootstrapcdn|google|jquerycdn|fontawesome|fontcdn)$/i;

export default handler;