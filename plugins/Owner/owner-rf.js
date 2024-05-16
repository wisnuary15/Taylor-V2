import {
    exec
} from 'child_process';
import {
    promisify
} from 'util';

let handler = async (m, {
    conn,
    isROwner,
    text
}) => {
    await m.reply(global.wait);
    if (!isROwner) return;
    const array = Object.keys(plugins);
    const execAsync = promisify(exec);
    let [input, destination] = text.split(' ');
    if (!input || !destination) return m.reply("Contoh penggunaan: Untuk mencari bagian, ketik *.rf anti-audio anti-audio2*");
    if (!/^[a-zA-Z0-9-_.]+$/.test(input)) return m.reply("Input tidak valid. Harap gunakan karakter yang aman.");
    const index = array.findIndex(item => item.includes(input));
    if (index !== -1) {
        const fileToCat = array[index];
        try {
            const replacedString = fileToCat.replace(/\/[^/]+\.js/g, `/${destination}.js`);
            const {
                stdout,
                stderr
            } = await execAsync(`mv ${fileToCat} ${replacedString}`);
            await m.reply(stdout || stderr);
        } catch (error) {
            await m.reply(`Terjadi kesalahan: ${error.message}`);
        }
    } else {
        const notFoundMessage = `Input ${input} tidak ditemukan dalam array. Berikut adalah daftar dengan nomor urutan:\n${array.map(item => item.split("/").pop().replace(".js", "")).map((item, i) => `${i + 1}. ${item}`).join('\n')}\nContoh penggunaan: Untuk mencari bagian, ketik *.rf anti-audio anti-audio2*`;
        await m.reply(notFoundMessage);
    }
}

handler.help = ['rfplugin'].map(v => v + ' <text>')
handler.tags = ['owner']
handler.command = /^rf(plugin)?$/i
handler.rowner = true

export default handler