import {
    ShortLink
} from "../../lib/tools/shortlink.js";
const short = new ShortLink();

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    args,
    text
}) => {
    const asyncFunctions = {
        adfoc: short.adfoc,
        bitly: short.bitly,
        cleanuri: short.cleanuri,
        cuttly: short.cuttly,
        dxyz: short.dxyz,
        gotiny: short.gotiny,
        isgd: short.isgd,
        kutt: short.kutt,
        linkpoi: short.linkpoi,
        multishort: short.multishort,
        onept: short.onept,
        ouo: short.ouo,
        rebrandly: short.rebrandly,
        shorte: short.shorte,
        shorturl: short.shorturl,
        shrtco: short.shrtco,
        tinyurl: short.tinyurl,
        tnyim: short.tnyim,
        vgd: short.vgd,
        vurl: short.vurl,
        ssur: short.ssur,
        adfly: short.adfly,
    };

    if (!text) {
        const asyncFunctionsList = Object.keys(asyncFunctions).map((func, index) => `- ${index + 1}. ${func}`).join('\n');
        return m.reply(`ℹ️ *Daftar Fungsi Short Link:*\n${asyncFunctionsList}\n\nℹ️ Gunakan format: .short <urutan> <URL>\n\nℹ️ Contoh Penggunaan: .short 1|https://example.com`);
    }

    try {
        const [order, url] = text.split('|') ?? [];
        if (!order || !url) throw new Error("ℹ️ Input tidak valid. Gunakan format: .short <urutan> <URL>\n\nℹ️ Contoh Penggunaan: .short 1|https://example.com");

        const numericOrder = parseInt(order);
        if (isNaN(numericOrder) || numericOrder <= 0 || numericOrder > Object.keys(asyncFunctions).length) {
            throw new Error("ℹ️ Urutan fungsi tidak valid. Gunakan nomor fungsi yang benar.");
        }

        m.reply("*ᴄᴏɴᴠᴇʀᴛɪɴɢ...*");

        const funcName = Object.keys(asyncFunctions)[numericOrder - 1];
        if (!funcName) throw new Error(`Async function dengan urutan ${order} tidak ditemukan.`);

        const output = await asyncFunctions[funcName](url);

        const reslink = output instanceof Object ?
            Object.entries(output).map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join('\n') :
            `🚀 *ʟɪɴᴋ:*\n${output}`;

        m.reply(reslink);
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ["short type|type"];
handler.tags = ["internet"];
handler.command = /^short(url)?$/i;

export default handler;