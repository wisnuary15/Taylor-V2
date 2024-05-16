import fetch from "node-fetch";

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Contoh Penggunaan:\n🤖 *${usedPrefix + command} halo*\n\nDan dengan Trigger:\n🤖 *${usedPrefix + command} |halo*`);

    let [trigger, message] = text.split("|").map(v => v.trim());
    let apiEndpoint = trigger ? "http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=" + encodeURIComponent(message) : "https://api.simsimi.net/v2/?text=" + text + "&lc=id";

    let api = await fetch(apiEndpoint);
    let res = await api.json();

    let translatedMessage = '';
    if (trigger) {
        let translationApi = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=" + res.cnt);
        let translatedResponse = await translationApi.json();
        translatedMessage = translatedResponse[0][0][0];
    }

    let replyText = `${translatedMessage || res.success}`;
    m.reply(replyText, null, m.mentionedJid ? {
        mentions: await conn.parseMention(m.text)
    } : {});
};

handler.command = ["simi"];
handler.tags = ["fun"];
handler.help = ["simi <pesan>"];

export default handler;