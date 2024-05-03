import fetch from "node-fetch"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text ? m.quoted.text : (() => {
        throw "Input Teks"
    })());
    await m.reply(wait);

    try {
        let data = await ContractGPT(text);
        data && await m.reply(data);
    } catch (e) {
        await m.reply(eror);
    }
}
handler.help = ["contractgpt"]
handler.tags = ["gpt"];
handler.command = /^(contractgpt)$/i

export default handler

/* New Line */
async function ContractGPT(content) {
    try {
        const response = await fetch("https://smart-contract-gpt.vercel.app/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content
                }]
            })
        });
        return await response.text();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}