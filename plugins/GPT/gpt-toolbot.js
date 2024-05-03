import fetch from "node-fetch";

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
        let result = await ToolbotAI(text)
        await m.reply(result.result)
    } catch (e) {
        await m.reply(eror)
    }
};
handler.help = ["toolbot"];
handler.tags = ["gpt"];
handler.command = /^(toolbot)$/i;

export default handler;

/* New Line */
async function fetchData(url, body) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });
        return await response.json();
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

async function ToolbotAI(desire) {
    try {
        const data = await fetchData("https://www.toolbot.ai/api/generate", {
            desire
        });
        const {
            description,
            prompt
        } = data.result[0];
        const data2 = await fetchData("https://www.toolbot.ai/api/query", {
            toolDescription: description,
            query: prompt,
        });
        return data2;
    } catch (error) {
        console.error("An error occurred:", error);
    }
}