import fetch from 'node-fetch';

const endpoint = 'https://v2-guru-indratensei.cloud.okteto.net/perplexity?query=';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
        conn.sendPresenceUpdate('composing', m.chat);
        let emsg = await conn.sendMessage(m.chat, {
            text: 'Thinking...'
        })
        const prompt = encodeURIComponent(text);

        const response = await fetch(endpoint + prompt);

        if (!response.ok) {
            throw `Received an error response from the server: ${response.status} - ${response.statusText}`;
        }

        const data = await response.json();
        const result = data.response.trim();
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: emsg.key,
                type: 14,
                editedMessage: {
                    conversation: result
                }
            }
        }, {})
    } catch (error) {
        console.error('Error:', error);
        m.reply(`An error occurred while processing your request. Please try again later.`);
    }
};
handler.help = ['aisearch']
handler.tags = ['ai']
handler.command = ['aisearch'];
handler.limit = true
export default handler;