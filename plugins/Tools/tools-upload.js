import {
    Uploader
} from "../../lib/tools/uploader.js";
const upload = new Uploader();

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    args,
    text
}) => {
    const asyncFunctions = {
        catbox: upload.catbox,
        fexnet: upload.fexnet,
        filebin: upload.filebin,
        fileio: upload.fileio,
        gofile: upload.gofile,
        hostfile: upload.hostfile,
        nullbyte: upload.nullbyte,
        pixeldrain: upload.pixeldrain,
        telegraPh: upload.telegraPh,
        tmpfiles: upload.tmpfiles,
        top4top: upload.top4top,
        transfersh: upload.transfersh,
        ucarecdn: upload.ucarecdn,
        uploadPomf2: upload.uploadPomf2,
        uploadToDiscdn: upload.uploadToDiscdn,
        uploadToKraken: upload.uploadToKraken,
        mediaUpload: upload.mediaUpload,
        sazumi: upload.sazumi,
        imgbb: upload.Imgbb,
        fileditch: upload.fileDitch,
        uguu: upload.Uguu,
        doodstream: upload.Doodstream,
    };

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw 'No media found';
    let media = await q.download();

    if (!text) {
        const asyncFunctionsList = Object.keys(asyncFunctions).map((func, index) => `- ${index + 1}. ${func}`).join('\n');
        return m.reply(`ℹ️ *Daftar Fungsi Upload Link:*\n${asyncFunctionsList}\n\nℹ️ Gunakan format: .upload <urutan>\n\nℹ️ Contoh Penggunaan: .upload 1`);
    }

    try {
        const order = text;
        if (!order) throw new Error("ℹ️ Input tidak valid. Gunakan format: .upload <urutan>\n\nℹ️ Contoh Penggunaan: .upload 1");

        const numericOrder = parseInt(order);
        if (isNaN(numericOrder) || numericOrder <= 0 || numericOrder > Object.keys(asyncFunctions).length) {
            throw new Error("ℹ️ Urutan fungsi tidak valid. Gunakan nomor fungsi yang benar.");
        }

        m.reply("*ᴜᴘʟᴏᴀᴅɪɴɢ...*");

        const funcName = Object.keys(asyncFunctions)[numericOrder - 1];
        if (!funcName) throw new Error(`Async function dengan urutan ${order} tidak ditemukan.`);

        const output = await asyncFunctions[funcName](media);

        const reslink = output instanceof Object ?
            Object.entries(output).map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join('\n') :
            `🚀 *ʟɪɴᴋ:*\n${output}`;

        m.reply(reslink);
    } catch (error) {
        m.reply(`Terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ["upload type"];
handler.tags = ["tools"];
handler.command = /^(upload)$/i;

export default handler;