import {
    fetch
} from 'undici';

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
        let result = await gptDeepenglish(text)
        await m.reply(result.answer)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["deepenglish"]
handler.tags = ["gpt"];
handler.command = /^(deepenglish)$/i
export default handler

/* New Line */
async function gptDeepenglish(input) {
    const messages = [{
            role: "assistant",
            content: "Kamu adalah asisten AI yang siap membantu segala hal."
        },
        {
            role: "user",
            content: input
        }
    ];

    try {
        const response = await fetch("https://deepenglish.com/wp-json/ai-chatbot/v1/chat", {
            method: "POST",
            headers: {
                Accept: "text/event-stream",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages
            })
        });

        return await response.json();
    } catch (error) {
        console.error("An error occurred during data fetching:", error);
        throw error;
    }
}