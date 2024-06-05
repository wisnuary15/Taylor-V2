import axios from 'axios';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    let lister = [
        "search",
        "chapter",
        "pdf"
    ]
    let [feature, inputs] = text.split("|")
    if (!lister.includes(feature)) return m.reply("*Example:*\n.batoto search|vpn\n\n*Pilih type yg ada*\n" + lister?.map((v, index) => "  ○ " + v).join("\n"))
    if (lister.includes(feature)) {
        if (feature === "search") {
            if (!inputs) return m.reply("Input query link\nExample: .batoto search|vpn")
            m.reply(wait)
            try {
                let res = await searchBatoto(inputs)
                let teks = res.results?.map((item, index) => {
                    return `- *Title:* ${item.title.original}\n- *ID:* ${item.id}\n- *Genre:* ${item.genres.join(', ')}`
                })?.filter(v => v).join("\n\n________________________\n\n")
                m.reply(teks)
            } catch (e) {
                m.reply(eror)
            }
        }
        if (feature === "chapter") {
            if (!inputs) return m.reply("Input query link\nExample: .batoto search|group")
            m.reply(wait)
            try {
                let res = await getID(inputs)
                let teks = res.chapters?.map((item, index) => {
                    return `- *Name:* ${item.name}\n- *ID:* ${item.id}`
                })?.filter(v => v).join("\n\n________________________\n\n")
                m.reply(teks)
            } catch (e) {
                m.reply(eror)
            }
        }
        if (feature === "pdf") {
            if (!inputs) return m.reply("Input query link\nExample: .batoto search|group")
            m.reply(wait)
            try {
                let linkArray = await getLinkArray(inputs)
                let data = await addImagesToPDF(linkArray.pages)
                conn.sendFile(m.chat, data, inputs, "DONE", m, null, {
                    mimetype: dpdf,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                })
            } catch (e) {
                m.reply(eror)
            }
        }
    }
}
handler.help = ["batoto"]
handler.tags = ["internet"]
handler.command = /^(batoto)$/i
export default handler
/* New Line */
async function searchBatoto(q) {
    try {
        const response = await axios.get('https://batotojs.tzurs11.repl.co/searchByKeyword/' + q);
        return response.data
    } catch (error) {
        console.error('Failed to fetch and parse the page:', error.message);
        throw error;
    }
};
async function getID(q) {
    try {
        const response = await axios.get('https://batotojs.tzurs11.repl.co/getByID/' + q);
        return response.data
    } catch (error) {
        console.error('Failed to fetch and parse the page:', error.message);
        throw error;
    }
};
async function getLinkArray(q) {
    try {
        const response = await axios.get('https://batotojs.tzurs11.repl.co/getChapterByID/' + q);
        return response.data
    } catch (error) {
        console.error('Failed to fetch and parse the page:', error.message);
        throw error;
    }
};
async function addImagesToPDF(imageLinks) {
    return new Promise(async (resolve) => {
        const pdf = new PDFDocument();
        for (const link of imageLinks) {
            const imageBuffer = await downloadImage(link);
            if (imageBuffer) {
                const convertedImageBuffer = await convertWebpToPNG(imageBuffer);
                pdf.addPage().image(convertedImageBuffer);
            }
        }
        const buffers = [];
        pdf.on('data', (chunk) => buffers.push(chunk));
        pdf.on('end', () => resolve(Buffer.concat(buffers)));
        pdf.end();
    });
}
async function downloadImage(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const imageBuffer = await response.arrayBuffer();
            return Buffer.from(imageBuffer);
        } else {
            console.error(`Error downloading image from ${url}`);
            return null;
        }
    } catch (error) {
        console.error(`Error downloading image from ${url}: ${error.message}`);
        return null;
    }
}
async function convertWebpToPNG(webpBuffer) {
    try {
        const pngBuffer = await sharp(webpBuffer).toFormat('png').toBuffer();
        return pngBuffer;
    } catch (error) {
        console.error('Error converting webp to PNG:', error.message);
        return null;
    }
}
