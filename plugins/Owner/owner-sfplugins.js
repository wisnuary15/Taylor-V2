import fs from 'fs';
import syntaxerror from 'syntax-error';

let handler = async (m, {
    text,
    usedPrefix,
    command
}) => {
    try {
        if (!text) return await conn.reply(m.chat, `uhm.. teksnya mana?\n\npenggunaan:\n${usedPrefix + command} <teks>\n\ncontoh:\n${usedPrefix + command} menu`, m);
        if (!m.quoted.text) return await conn.reply(m.chat, `balas pesan nya!`, m);
        let path = `plugins/${text}.js`;
        const fileContent = Buffer.from((m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description)) || '', 'utf-8');
        const err = syntaxerror(fileContent, path, {
            sourceType: 'module',
            ecmaVersion: 2020,
            allowAwaitOutsideFunction: true,
            allowReturnOutsideFunction: true,
            allowImportExportEverywhere: true
        });
        if (err) return await conn.reply(m.chat, `Terjadi kesalahan sintaks: ${err.message}`, m);

        await fs.writeFileSync(path, (m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description)) || '');
        await conn.reply(m.chat, `Tersimpan di ${path}`, m);
    } catch (error) {
        await conn.reply(m.chat, `Terjadi kesalahan: ${error}`, m);
    }
};

handler.help = ['sfp'].map(v => v + ' <teks>');
handler.tags = ['owner'];
handler.command = /^sfp$/i;
handler.rowner = true;

export default handler;