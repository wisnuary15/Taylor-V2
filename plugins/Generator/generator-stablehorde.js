import {
    StableHorde
} from '../../lib/maker/stablehorde.js';

const apiKey = "0000000000";
const stableHorde = new StableHorde({
    apiKey
});

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    const input_data = ["text", "image"];
    let [urutan, tema, queer] = text.split("|");
    urutan = parseInt(urutan);
    tema = parseInt(tema);

    if (isNaN(urutan) || urutan < 1 || urutan > input_data.length) {
        const validInputList = input_data.map((item, index) => `${index + 1}. ${item}`).join('\n');
        return m.reply(`Nomor yang Anda masukkan tidak valid. Harap pilih nomor antara 1 dan ${input_data.length}:\n${validInputList}\n*Example:*\n*${usedPrefix + command}* 2|999|men ( image )\n*${usedPrefix + command}* 2|999|hallo ( text )`);
    }

    let out = input_data[urutan - 1];
    if (!queer) return m.reply(`Harap masukkan query untuk menghasilkan teks atau gambar.\n*Example:*\n*${usedPrefix + command}* 2|999|men ( image )\n*${usedPrefix + command}* 2|999|hallo ( text )`);

    switch (out) {
        case "text":
            const textModels = await stableHorde.textModels();
            if (isNaN(tema) || tema < 1 || tema > textModels.length) {
                const validTemaList = textModels.map((item, index) => `${index + 1}. ${item}`).join('\n');
                return m.reply(`Nomor yang Anda masukkan tidak valid. Harap pilih nomor antara 1 dan ${textModels.length}:\n${validTemaList}`);
            }
            const modelText = textModels[tema - 1];
            try {
                const generatedText = await stableHorde.generateText(queer, modelText);
                await m.reply(generatedText);
            } catch (e) {
                return m.reply("Terjadi kesalahan saat menghasilkan teks.");
            }
            break;
        case "image":
            const imageModels = await stableHorde.imageModels();
            const sortedNames = imageModels.sort((a, b) => b.performance - a.performance).map(item => item.name);
            if (isNaN(tema) || tema < 1 || tema > sortedNames.length) {
                const validTemaList = sortedNames.map((item, index) => `${index + 1}. ${item}`).join('\n');
                return m.reply(`Nomor yang Anda masukkan tidak valid. Harap pilih nomor antara 1 dan ${sortedNames.length}:\n${validTemaList}`);
            }
            const modelImage = sortedNames[tema - 1];
            try {
                const generatedImageURL = await stableHorde.generateImage(modelImage, queer);
                await conn.sendFile(m.chat, generatedImageURL, '', '', m);
            } catch (e) {
                return m.reply("Terjadi kesalahan saat menghasilkan gambar.");
            }
            break;
        default:
            return m.reply("Jenis input yang diberikan tidak valid.");
    }
}

handler.help = ["horde *[nomor]|[query]*"];
handler.tags = ["generator"];
handler.command = /^(horde)$/i;
export default handler;