import figlet from 'figlet';

let handler = async (m, {
    text
}) => {
    let [urutan, tema] = text.split("|");

    if (!tema) return m.reply("Input query!\n*Example:*\n.ascii [nomor]|[query]");

    await m.reply("Processing, please wait...");

    try {
        const fonts = await getAvailableFonts();
        let data = fonts.map((font, index) => `*${index + 1}.* ${font}`).join("\n");

        if (!urutan) return m.reply("Input query!\n*Example:*\n.ascii [nomor]|[query]\n\n*Choose from the available fonts*\n" + data);
        if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.ascii [nomor]|[query]\n\n*Choose from the available fonts*\n" + data);
        if (urutan < 1 || urutan > fonts.length) return m.reply("Invalid selection!\n\n*Choose from the available fonts*\n" + data);

        let selectedFont = fonts[urutan - 1];
        let asciiArt = await generateASCIIArt(selectedFont, tema);

        if (asciiArt) {
            await m.reply(asciiArt);
        } else {
            console.log("Error generating ASCII art.");
        }
    } catch (e) {
        console.error(e);
        await m.reply("An error occurred while processing your request.");
    }
};

handler.help = ["ascii *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(ascii)$/i;
export default handler;

async function generateASCIIArt(font, message) {
    return new Promise((resolve, reject) => {
        figlet.text(message, {
            font
        }, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function getAvailableFonts() {
    return new Promise((resolve, reject) => {
        figlet.fonts((err, fonts) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(fonts);
            }
        });
    });
}