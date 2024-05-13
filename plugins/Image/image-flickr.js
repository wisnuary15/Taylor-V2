import axios from "axios";

const api_Key = "636e1481b4f3c446d26b8eb6ebfe7127";
const URL = "https://farm66.staticflickr.com";

const handler = async (m, {
    conn,
    args,
    command,
    isOwner
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);

    try {
        await m.reply('Please wait...');
        const image = await searchTopic(text);
        const rand = getRandom(image);
        const resultUrl = `${URL}/${rand.server}/${rand.id}_${rand.secret}.jpg`;
        conn.sendFile(m.chat, resultUrl, "result.jpg", `Result Flickr: *${text.toUpperCase()}*`, m);
    } catch (error) {
        throw error;
    }
};

handler.help = ["flickr"];
handler.tags = ["search"];
handler.command = /^(flickr)$/i;

export default handler;

async function searchTopic(query) {
    try {
        const response = await axios.get(
            `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_Key}&tags=${query}&per_page=24&format=json&nojsoncallback=1`
        );
        return response.data?.photos?.photo;
    } catch (error) {
        throw error;
    }
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
