import axios from "axios"

let handler = async (m, {
    conn,
    isOwner,
    usedPrefix,
    command,
    args
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    try {
        m.reply(wait)
        var imge = await searchImages(text)
        var xmg = imge.getRandom()

        conn.sendFile(m.chat, xmg.urls.full ? xmg.urls.regular : xmg.urls.thumb, "result", "Result Unsplash: *" + xmg.description + "*", m)
    } catch (e) {
        throw eror
    }
}
handler.help = ["unsplash"]
handler.tags = ["misc"]
handler.command = /^(unsplash)$/i
export default handler

async function searchImages(term) {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
        headers: {
            Authorization: "Client-ID mxr-J3YtqewQPrikLf7npmJY7ZvKKcxg7erlUer4bJM",
        },
        params: {
            query: term,
        },
    });

    return response.data.results;
};