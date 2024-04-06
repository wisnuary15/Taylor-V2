import {
    TrueLogin,
    TrueOtp,
    TrueSearch
} from "../../lib/info/truecaller.js";
import chalk from 'chalk';

const handler = async (m, {
    conn,
    command,
    usedPrefix,
    text
}) => {
    conn.truecallerIds = conn.truecallerIds || {};

    if (!text) {
        return m.reply(`
            Masukkan query. Contoh: ${usedPrefix + command} send number
            Penggunaan:
            ${usedPrefix + command} verify number key otp
            ${usedPrefix + command} search number token
        `.trim());
    }

    try {
        let message = '';
        let res;

        if (command === 'truecaller') {
            const [method, number, key, otp] = text.split(" ");
            if (method && number && ((method === 'send' && !otp) || (method === 'verify' && key && otp) || (method === 'search' && key))) {
                switch (method) {
                    case 'send':
                        res = await TrueLogin(number);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'verify':
                        res = await TrueOtp(number, key, otp);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'search':
                        res = await TrueSearch(number, key);
                        message = JSON.stringify(res, null, 2)
                        break;
                    default:
                        message = 'ID eksternal tidak valid. ❌';
                        break;
                }
            } else {
                message = 'Format pesan tidak sesuai. Pastikan Anda telah memasukkan method, nomor, key, dan otp dengan benar. ❗';
            }
        } else {
            message = 'Perintah tidak valid. ❌';
        }

        await m.reply(message);
    } catch (error) {
        console.error(chalk.red('Error:', error.message));
        await m.reply(`Error: ${error.message} ❌`);
    }
};

handler.help = ["truecaller"];
handler.tags = ["ai"];
handler.command = /^(truecaller)$/i;

export default handler;