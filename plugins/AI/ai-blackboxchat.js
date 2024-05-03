import {
    Blackbox
} from "../../lib/ai/blackbox.js";
const blackbox = new Blackbox();

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let text = args.length >= 1 ? args.join(" ") : (m.quoted && m.quoted.text) || (() => {
        throw "Input Teks"
    })()

    await m.reply(wait)

    try {
        const input = [{
            role: "user",
            content: text
        }]
        const data = await blackbox.chat(input, "Realtime", true)
        if (data) await m.reply(data)
    } catch (e) {
        await m.reply(eror)
    }
}

handler.help = ["blackboxchat"]
handler.tags = ["ai"];
handler.command = /^(blackboxchat)$/i

export default handler