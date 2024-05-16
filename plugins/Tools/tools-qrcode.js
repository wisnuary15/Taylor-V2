import {
    toDataURL,
    toBuffer
} from 'qrcode';

let handler = async (m, {
    conn,
    usedPrefix,
    args,
    command
}) => {
    let text;
    try {
        text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted.text) || '';
        if (!text) throw "Input teks atau reply teks yang ingin dijadikan QR!";
        await m.reply('Menunggu...');

        const generate = await generateQRCode(text.slice(0, 2048));
        const caption = `Balas gambar ini untuk membaca QR. Ketik *.readqrcode* `;
        await conn.sendFile(m.chat, generate.buffer, 'qrcode.png', caption, m);
    } catch (error) {
        await m.reply('Terjadi kesalahan saat membuat QR code');
    }
};
handler.help = ['', 'code'].map(v => 'qr' + v + ' <teks>');
handler.tags = ['tools'];
handler.command = ['qr', 'qrcode'];
export default handler;

const generateQRCode = async text => {
    try {
        const options = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            quality: 0.3,
            margin: 1,
            color: {
                dark: "#010599FF",
                light: "#FFBF60FF"
            }
        };
        const qrCodeBuffer = await toBuffer(text, options);
        const qrCodeUrl = await toDataURL(text, options);
        return {
            buffer: qrCodeBuffer,
            base64: qrCodeUrl
        };
    } catch (error) {
        console.error(error);
        throw new Error('Gagal membuat QR code');
    }
};