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
        let res = await LemurChat(text)
        await m.reply(res)
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["lemurchat"]
handler.tags = ["gpt"];
handler.command = /^(lemurchat)$/i

export default handler

/* New Line */
async function LemurChat(your_qus) {
    let baseURL = "http://lemurchat.anfans.cn";

    const requestData = `{"messages":"[{\\"content\\":\\"\\",\\"id\\":\\"LEMUR_AI_SYSTEM_SETTING\\",\\"isSensitive\\":false,\\"needCheck\\":false,\\"role\\":\\"system\\"},{\\"content\\":\\"${your_qus}\\",\\"isSensitive\\":false,\\"needCheck\\":true,\\"role\\":\\"user\\"}]"}`

    const response = await fetch(baseURL + "/api/chat/conversation-trial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 4 Prime) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"
        },
        body: (requestData),
        responseType: "stream"
    });

    const res = await response.text();
    const sp = res.replace(/id: \d+\ndata: '/, '\n')
    const data = sp.split('\n')
    var filteredData = data.filter(item => item.startsWith('data:'));
    const dataArray = filteredData.map(item => JSON.parse(item.replace(/^data: /, '')));
    var input = dataArray.map(v => v.data).join('')

    const regex = /"content":"(.*?)"/g;
    const contents = [];
    let match;

    while ((match = regex.exec(input)) !== null) {
        contents.push(match[1]);
    }

    return (contents.join('').replace(/\\n/g, '\n'));
}