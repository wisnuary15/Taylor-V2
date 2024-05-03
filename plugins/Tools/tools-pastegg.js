import fetch from 'node-fetch';

let handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    try {
        const teks = m.quoted ? m.quoted.text : text
        if (!teks) throw 'No text found';
        await m.reply(wait);
        const response = await pasteGG(teks);
        if (response) {
            const pesan = `*Pesan Anda berhasil terkirim! 🚀*\n\n*Detail:*\n*URL:* ${response}`;
            await m.reply(pesan);
        } else {
            await m.reply('Pesan Anda gagal terkirim. 🙁');
        }
    } catch (error) {
        console.error(error);
        await m.reply('Terjadi kesalahan dalam pemrosesan permintaan Anda. 🙁');
    }
};
handler.help = ['pastegg <text>']
handler.tags = ['tools']
handler.command = /^(pastegg)$/i
export default handler;

async function pasteGG(input) {
    try {
        const res = await fetch("https://api.paste.gg/v1/pastes", {
            method: "POST",
            body: JSON.stringify({
                files: [{
                    content: {
                        format: "text",
                        value: input,
                    },
                }, ],
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await res.json();
        return `https://paste.gg/p/anonymous/${json.result.id}`;
    } catch (error) {
        console.error('Error:', error.message);
        // Handle errors as needed
    }
}