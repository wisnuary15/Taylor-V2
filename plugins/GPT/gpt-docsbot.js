import fetch from "node-fetch"

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
        let res = await chatWithGPT(text)
        await m.reply(res.answer)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["docsbot"]
handler.tags = ["gpt"];
handler.command = /^(docsbot)$/i

export default handler

/* New Line */
async function chatWithGPT(messages) {
    try {
        const response = await fetch(
            "https://api.docsbot.ai/teams/AQlopPkXnxW7eKsGqeSe/bots/lnPRMgAXQgaYl0JG0uXj/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: messages,
                    full_source: true,
                    format: "text",
                    history: [],
                })
            }
        );

        const Response = await response.json();
        return Response;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}