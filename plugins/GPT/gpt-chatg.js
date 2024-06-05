import axios from 'axios';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    m.reply(wait)
    try {
        let result = await generate(text)
        m.reply(result.reply)
    } catch (e) {
        m.reply(eror)
    }
}
handler.help = ["chatg"]
handler.tags = ["gpt"];
handler.command = /^(chatg)$/i
export default handler
/* New Line */
async function generate(q) {
    try {
        const {
            data
        } = await axios(
            `https://chatg.io/wp-json/mwai-ui/v1/chats/submit`, {
                method: "post",
                data: {
                    botId: "default",
                    newMessage: q,
                    stream: false,
                },
                headers: {
                    Accept: "text/event-stream",
                    "Content-Type": "application/json",
                },
            }
        );
        return data;
    } catch (err) {
        console.log(err.response.data);
        return err.response.data.message;
    }
}
