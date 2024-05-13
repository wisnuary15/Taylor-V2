import fetch from "node-fetch"

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    
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