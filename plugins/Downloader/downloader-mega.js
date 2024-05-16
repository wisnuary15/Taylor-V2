import {
    File
} from "megajs";
import {
    fileTypeFromBuffer
} from "file-type";

let handler = async (m, {
    conn,
    text,
    command,
    usedPrefix
}) => {
    try {
        if (!text) return m.reply(`Contoh:\n${usedPrefix + command} https://mega.nz/file/0FUA2bzb#vSu3Ud9Ft_HDz6zPvfIg_y62vE1qF8EmoYT3kY16zxo`);
        const file = File.fromURL(text);
        await file.loadAttributes();
        if (file.size >= 300000000) return m.reply('Error: ukuran file terlalu besar (Ukuran Max: 300MB)');
        m.reply(`*_Mohon tunggu beberapa menit..._*\n${file.name} sedang diunduh...`);
        const data = await file.downloadBuffer();

        const {
            mime,
            ext
        } = await fileTypeFromBuffer(data);
        if (!mime) return m.reply('Error: Tipe file tidak dapat ditentukan');

        await conn.sendMessage(m.chat, {
            document: data,
            mimetype: mime,
            filename: `${file.name}.${ext}`
        }, {
            quoted: m
        });
    } catch (error) {
        return m.reply(`Error: ${error.message}`);
    }
};

handler.help = ["mega"];
handler.tags = ["downloader"];
handler.command = /^(mega(js)?)$/i;
export default handler;