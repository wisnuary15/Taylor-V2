import fetch from "node-fetch"
import fs from "fs"

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    await m.reply(wait)
    CarbonifyV1(text)
        .then((result) => {
            return conn.sendFile(m.chat, result, "", "*V1 by:*\n" + m.name, m);
        })
        .catch(() => {
            return CarbonifyV2(text)
                .then((result) => {
                    return conn.sendFile(m.chat, result, "", "*V2 by:*\n" + m.name, m);
                })
                .catch((error) => {
                    throw error;
                });
        });

}
handler.help = ["carbon"]
handler.tags = ["misc"]
handler.command = /^carbon(ify)?$/i
export default handler

async function CarbonifyV1(input) {
    let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "code": input
            })
        })
        .then(response => response.blob())
    let arrayBuffer = await Blobs.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    return buffer
}

async function CarbonifyV2(input) {
    let Blobs = await fetch("https://carbon-api.vercel.app/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "code": input
            })
        })
        .then(response => response.blob())
    let arrayBuffer = await Blobs.arrayBuffer();
    let buffer = Buffer.from(arrayBuffer);
    return buffer
}