import fetch from "node-fetch"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw "Input Teks"
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