import fetch from "node-fetch";
const fetchAPI = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        throw new Error(`Fetch API failed: ${error.message}`);
    }
};
const translateText = async (text) => {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Translation API response was not ok: ${response.statusText}`);
        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        throw new Error(`Translation failed: ${error.message}`);
    }
};
const handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.join(" ") : (m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) {
        return m.reply(`Contoh Penggunaan:\n🤖 *${usedPrefix + command} halo*\n\nDan dengan Trigger:\n🤖 *${usedPrefix + command} |halo*`);
    }
    const [trigger, message] = text.split("|")?.map(v => v.trim());
    const apiEndpoint = trigger ?
        `http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=${encodeURIComponent(message)}` :
        `https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id`;
    try {
        const res = await fetchAPI(apiEndpoint);
        let replyText = res.success || res.cnt;
        if (trigger) {
            const translatedMessage = await translateText(res.cnt);
            replyText = translatedMessage;
        }
        m.reply(replyText, null, m.mentionedJid ? {
            mentions: conn.parseMention(m.text)
        } : {});
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};
handler.command = ["simi"];
handler.tags = ["fun"];
handler.help = ["simi <pesan>"];
export default handler;
