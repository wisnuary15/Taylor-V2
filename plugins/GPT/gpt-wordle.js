import fetch from "node-fetch";
import crypto from "crypto";

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
        let res = await gptWordle(text)
        await m.reply(res.message.content)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["wordle"]
handler.tags = ["gpt"];
handler.command = /^(wordle)$/i

export default handler

/* New Line */
const generateRandomIP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

const generateRandomUserAgent = () => {
    const androidVersions = ['4.0.3', '4.1.1', '4.2.2', '4.3', '4.4', '5.0.2', '5.1', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0'];
    const deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    const buildVersions = ['RP1A.200720.011', 'RP1A.210505.003', 'RP1A.210812.016', 'QKQ1.200114.002', 'RQ2A.210505.003'];
    const selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
    const selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)];
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;
    const userAgent = `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
    return userAgent;
};

const gptWordle = async (prompt) => {
    try {
        const data = {
            user: crypto.randomBytes(8).toString('hex'),
            messages: [{
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: "Kamu adalah asisten AI yang siap membantu segala hal!"
                }
            ],
            subscriber: {
                originalAppUserId: `$RCAnonymousID:${crypto.randomBytes(16).toString('hex')}`,
                requestDate: new Date().toISOString(),
                firstSeen: new Date().toISOString(),
            }
        };

        const response = await fetch("https://wewordle.org/gptapi/v1/web/turbo", {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'pragma': 'no-cache',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                "user-agent": generateRandomUserAgent(),
                "x-forwarded-for": generateRandomIP()
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};