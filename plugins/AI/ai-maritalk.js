import fetch from "node-fetch";

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    
    await m.reply(wait)
    try {
        let res = await mariTalk(text)
        await m.reply(res.answer)
    } catch (e) {
        await m.reply(eror)
    }
};
handler.help = ["maritalk"];
handler.tags = ["ai"];
handler.command = /^(maritalk)$/i;

export default handler;

/* New Line */
async function mariTalk(q) {
    try {
        const response = await fetch('https://chat.maritaca.ai/api/chat/inference', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'key 100967333014773694334$301a2d09eb5a949372342c6ce125335b346740cecd46dbe12fc2fa326cf315f3',
            },
            body: JSON.stringify({
                messages: [{
                        role: 'assistant',
                        content: 'Hello!',
                    },
                    {
                        role: 'user',
                        content: q,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
}