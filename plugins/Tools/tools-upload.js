import {
    Uploader
} from "../../lib/tools/uploader.js";
const upload = new Uploader();
const handler = async (m, {
    command,
    usedPrefix,
    conn,
    args,
    text
}) => {
    const asyncFunctions = {
        Doodstream: upload.Doodstream,
        Imgbb: upload.Imgbb,
        Uguu: upload.Uguu,
        catbox: upload.catbox,
        fexnet: upload.fexnet,
        fileDitch: upload.fileDitch,
        filebin: upload.filebin,
        fileio: upload.fileio,
        freeImage: upload.freeImage,
        gofile: upload.gofile,
        hostfile: upload.hostfile,
        mediaUpload: upload.mediaUpload,
        nullbyte: upload.nullbyte,
        pixeldrain: upload.pixeldrain,
        sazumi: upload.sazumi,
        telegraPh: upload.telegraPh,
        tmpfiles: upload.tmpfiles,
        top4top: upload.top4top,
        transfersh: upload.transfersh,
        ucarecdn: upload.ucarecdn,
        uploadPomf2: upload.uploadPomf2,
        uploadToDiscdn: upload.uploadToDiscdn,
        uploadToKraken: upload.uploadToKraken
    };
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime) throw 'No media found';
    const media = await q?.download();
    const asyncFunctionsList = Object.keys(asyncFunctions)?.map((func, index) => `- *${index + 1}.* ${func.toUpperCase()}`).join('\n');
    if (!text) return m.reply(`ℹ️ *Daftar Fungsi Upload Link:*\n${asyncFunctionsList}\n\nℹ️ Gunakan format: .upload <urutan>\n\nℹ️ Contoh Penggunaan: .upload 1`);
    try {
        const order = parseInt(text);
        if (isNaN(order) || order <= 0 || order > Object.keys(asyncFunctions).length) {
            return m.reply(`ℹ️ *Daftar Fungsi Upload Link:*\n${asyncFunctionsList}\n\nℹ️ Gunakan format: .upload <urutan>\n\nℹ️ Contoh Penggunaan: .upload 1`);
        }
        m.reply("*ᴜᴘʟᴏᴀᴅɪɴɢ...*");
        const funcName = Object.keys(asyncFunctions)[order - 1];
        const output = await asyncFunctions[funcName](media);
        const reslink = typeof output === 'object' ?
            Object.entries(output)?.map(([key, value]) => `  ○ *${key.toUpperCase()}:* ${value}`).join('\n') :
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
