import fetch from "node-fetch";
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description)) || null;
    if (!text) return m.reply(`Masukkan teks atau balas pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    try {
        const messages = [{
                role: "system",
                content: "Anda adalah asisten yang membantu."
            },
            {
                role: "user",
                content: text
            }
        ];
        const output = await AichatOs(messages[0]?.content, messages[1].content);
        m.reply(output);
    } catch (e) {
        m.reply("Terjadi kesalahan.");
    }
};
handler.help = ['aichatos'];
handler.tags = ['ai'];
handler.command = /^(aichatos)$/i;
export default handler;
async function AichatOs(system, prompt) {
    try {
        const host = "api.aichatos.cloud";
        const port = "443";
        const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0";
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authority': 'p5.v50.ltd',
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'https://chat9.yqcloud.top',
                'User-Agent': userAgent,
            },
            body: JSON.stringify({
                prompt,
                network: true,
                system,
                withoutContext: false,
                stream: false
            })
        };
        const response = await fetch(`https://${host}:${port}/api/generateStream`, requestOptions);
        const data = await response.text();
        return data;
    } catch (e) {
        throw new Error("Error fetching data from AI service.");
    }
}
