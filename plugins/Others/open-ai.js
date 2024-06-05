import fetch from 'node-fetch';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Input query text!\n*Example:*\n- *${usedPrefix + command}* hello`);
    try {
        const result = await CleanDx(text);
        m.reply(result);
    } catch (error) {
        console.error("Error:", error);
        m.reply("An error occurred while processing your request.");
    }
};
handler.help = ["ai"];
handler.tags = ["ai", "gpt"];
handler.command = /^(ai)$/i;
export default handler;
async function CleanDx(your_qus) {
    try {
        let linkaiList = [];
        let Baseurl = "https://vipcleandx.xyz/";
        linkaiList.push({
            content: your_qus,
            role: "user",
            nickname: "",
            time: Date.now(),
            isMe: true
        });
        linkaiList.push({
            content: "Anda adalah asisten yang membantu.",
            role: "assistant",
            nickname: "AI",
            time: Date.now(),
            isMe: false
        });
        if (linkaiList.length > 10) linkaiList.shift();
        let response = await fetch(Baseurl + "v1/chat/gpt/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Forwarded-For": Array.from({
                    length: 4
                }, () => Math.floor(Math.random() * 256)).join('.'),
                Referer: Baseurl,
                Accept: "application/json, text/plain, */*"
            },
            body: JSON.stringify({
                list: linkaiList,
                id: Math.floor(Math.random() * 256),
                title: your_qus,
                prompt: "",
                temperature: 0.7,
                models: 0,
                continuous: true,
                is_web: true
            })
        });
        return await response.text();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}
