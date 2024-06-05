import fetch from "node-fetch";
import fs from 'fs';
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    conn.ohmygpt = conn.ohmygpt || {};
    const data = fs.readFileSync('./json/ai/system-message.json');
    const characterCategories = JSON.parse(data);
    const categoryNames = Object.keys(characterCategories);
    if (command === 'ohmygptset') {
        const categoryIndex = parseInt(args[0]) - 1;
        const characterIndex = parseInt(args[1]) - 1;
        const selectedCategory = categoryNames[categoryIndex];
        if (!selectedCategory || !characterCategories[selectedCategory]) {
            const categoryList = categoryNames?.map((v, i) => `*${i + 1}.* ${v}`).join('\n');
            return m.reply(`Nomor kategori tidak valid. Pilih nomor antara 1 dan ${categoryNames.length}.\nKategori yang tersedia:\n${categoryList}`);
        }
        const characterNames = Object.keys(characterCategories[selectedCategory]);
        const selectedCharacter = characterNames[characterIndex];
        if (selectedCharacter) {
            conn.ohmygpt = {
                name: selectedCharacter,
                profile: characterCategories[selectedCategory][selectedCharacter],
            };
            return m.reply(`Karakter diatur menjadi: *${conn.ohmygpt.name}*`);
        } else {
            const characterList = characterNames?.map((v, i) => `*${i + 1}.* ${v}`).join('\n');
            return m.reply(`Nomor karakter tidak valid. Pilih nomor antara 1 dan ${characterNames.length}.\nContoh penggunaan:\n*${usedPrefix}${command} 1 2*\nKarakter yang tersedia:\n${characterList}`);
        }
    }
    if (!conn.ohmygpt.name && !conn.ohmygpt.profile) {
        return m.reply(`Atur karakter sebelum menggunakan.\nGunakan command *${usedPrefix}ohmygptset* untuk mengatur karakter.\nKarakter yang tersedia:\n${categoryNames?.map((v, i) => `*${i + 1}.* ${v}`).join('\n')}`);
    }
    if (command === 'ohmygpt') {
        const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
        if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
        m.reply(wait);
        try {
            const output = await chatAI(text, conn.ohmygpt.profile);
            if (output) {
                m.reply(`*${conn.ohmygpt.name}*\n\n${output}`);
            } else {
                m.reply("Tidak ada output yang dihasilkan.");
            }
        } catch (error) {
            console.error('Error during chatAI:', error);
            m.reply('Terjadi kesalahan selama pemrosesan.');
        }
    }
};
handler.help = ["ohmygpt", "ohmygptset"];
handler.tags = ["ai"];
handler.command = /^(ohmygpt|ohmygptset)$/i;
export default handler;
async function chatAI(query, profile, model) {
    const headers = {
        "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
        "Content-Type": "application/json",
        "Authorization": "sk-0A810pRkyDOOtZ76DR1voGsMFAfMcJQTxZ5BYRAJHwPLzZnc"
    };
    const raw = JSON.stringify({
        model: model || "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: profile
        }, {
            role: "user",
            content: query
        }],
        stream: false
    });
    const options = {
        method: 'POST',
        headers,
        body: raw,
        redirect: 'follow'
    };
    try {
        const response = await fetch("https://api.ohmygpt.com/v1/chat/completions", options);
        const data = await response.json();
        return data.choices[0]?.message.content;
    } catch (error) {
        console.error('Error:', error);
    }
}
