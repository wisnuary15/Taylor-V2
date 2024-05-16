const komikCast = await (await import("../../lib/download/komikcast.js")).default;
const Comic = new komikCast();

let handler = async (m, {
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
    ];

    let [feature, inputs, inputs_] = text.split("|");
    if (!lister.includes(feature)) {
        return m.reply("*Contoh:*\n.komikcast search|vpn\n\n*Pilih tipe yang ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
    }

    if (lister.includes(feature)) {
        if (feature == "search") {
            if (!inputs) return m.reply("Masukkan query link\nContoh: .komikcast search|vpn");
            await m.reply(wait);
            try {
                let res = await Comic.search(inputs, {
                    type: inputs_ || ''
                });
                let teks = res.data.map((item, index) => {
                    return `
*Judul:* ${item.title}
*Tipe:* ${item.type}
*Bab:* ${item.chapter}
*Skor:* ${item.score}
*URL:* ${item.url}
                    `;
                }).filter(v => v).join("\n\n________________________\n\n");
                await m.reply(teks);
            } catch (e) {
                await m.reply(eror);
            }
        }

        if (feature == "chapter") {
            if (!inputs) return m.reply("Masukkan query link\nContoh: .komikcast chapter|group");
            await m.reply(wait);
            try {
                let res = await Comic.info(inputs);
                let teks = res.chapters.map((item, index) => {
                    return `
*Judul:* ${item.title}
*URL:* ${item.url}
*Waktu:* ${item.time}
                    `;
                }).filter(v => v).join("\n\n________________________\n\n");
                await m.reply(teks);
            } catch (e) {
                await m.reply(eror);
            }
        }

        if (feature == "pdf") {
            if (!inputs) return m.reply("Masukkan query link\nContoh: .komikcast search|group");
            await m.reply(wait);
            try {
                let imagePdf = await Comic.image(inputs);
                let data = await Comic.imagePdf(imagePdf);

                await conn.sendFile(m.chat, data, inputs, "SELESAI", m, null, {
                    mimetype: dpdf,
                    contextInfo: {
                        mentionedJid: [m.sender]
                    }
                });
            } catch (e) {
                await m.reply(eror);
            }
        }
    }
};

handler.help = ["komikcast"];
handler.tags = ["internet"];
handler.command = /^(komikcast)$/i;
export default handler;