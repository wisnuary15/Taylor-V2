import fetch from 'node-fetch';

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    if (!text) return m.reply("Input query\nExample: .ai hello")
    try {
        const result = await CleanDx(text);
        await m.reply(result);
    } catch (error) {
        await m.reply(error);
    }
}
handler.help = ["ai"]
handler.tags = ["ai", "gpt"];
handler.command = /^(ai)$/i
export default handler

async function CleanDx(your_qus) {
    try {
        let linkaiList = [];
        let linkaiId = Array.from({
            length: 21
        }, () => Math.random().toString(36)[2]).join('');
        let Baseurl = "https://vipcleandx.xyz/";
        linkaiList.push({
            "content": your_qus,
            "role": "user",
            "nickname": "",
            "time": `${(new Date()).getHours().toString().padStart(2, '0')}:${(new Date()).getMinutes().toString().padStart(2, '0')}:${(new Date()).getSeconds().toString().padStart(2, '0')}`,
            "isMe": true
        });
        linkaiList.push({
            "content": "",
            "role": "assistant",
            "nickname": "AI",
            "time": `${(new Date()).getHours().toString().padStart(2, '0')}:${(new Date()).getMinutes().toString().padStart(2, '0')}:${(new Date()).getSeconds().toString().padStart(2, '0')}`,
            "isMe": false
        });
        if (linkaiList.length > 10) linkaiList.shift();
        let response = await fetch(Baseurl + "v1/chat/gpt/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Forwarded-For": Array.from({
                    length: 4
                }, () => Math.floor(Math.random() * 256)).join('.'),
                "Referer": Baseurl,
                "accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify({
                "list": linkaiList,
                "id": linkaiId,
                "title": your_qus,
                "prompt": "",
                "temperature": 0.5,
                "models": "0",
                "continuous": true
            })
        });
        return await response.text();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}