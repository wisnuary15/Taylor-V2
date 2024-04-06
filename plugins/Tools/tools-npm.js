import fetch from 'node-fetch';

const handler = async (m, {
    text
}) => {
    try {
        if (!text) throw 'Inputkan Query';

        const res = await fetch(`http://registry.npmjs.com/-/v1/search?text=${text}`);
        const {
            objects
        } = await res.json();

        if (!objects.length) throw `Query "${text}" tidak ditemukan :/`;

        const txt = objects.map(({
            package: pkg
        }) => (
            `📦 *${pkg.name}* (v${pkg.version})\n🔗 _${pkg.links.npm}_\n📝 _${pkg.description}_`
        )).join('\n\n');

        m.reply(txt);
    } catch (error) {
        m.reply(error);
    }
};

handler.help = ['npmsearch'];
handler.tags = ['tools'];
handler.command = /^(npmjs|npmsearch)$/i;

export default handler;