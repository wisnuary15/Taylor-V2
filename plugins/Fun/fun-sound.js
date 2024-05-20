import fetch from 'node-fetch';
import fs from 'fs';

const toM = a => '@' + a.split('@')[0];
const soundAlphabets = [
    "anjay", "ara-ara", "ara-ara-cowok", "ara-ara2", "arigatou", "assalamualaikum", "asu", "ayank", "aku-ngakak",
    "bacot", "bahagia-aku", "baka", "bansos", "beat-box", "beat-box2", "biasalah", "bidadari", "bot", "buka-pintu",
    "canda-anjing", "cepetan", "cuekin-terus", "daisuki-dayo", "daisuki", "dengan-mu", "gaboleh-gitu", "gak-lucu",
    "gamau", "gay", "gelay", "gitar", "gomenasai", "hai-bot", "hampa", "hayo", "hp-iphone", "i-like-you", "ih-wibu",
    "india", "karna-lo-wibu", "kiss", "kontol", "ku-coba", "maju-wibu", "makasih", "mastah", "nande-nande", "nani",
    "ngadi-ngadi", "nikah", "nuina", "onichan", "owner-sange", "ownerku", "pak-sapardi", "pale", "pantek", "pasi-pasi",
    "punten", "sayang", "siapa-sih", "sudah-biasa", "summertime", "tanya-bapak-lu", "to-the-bone", "wajib", "waku", "woi",
    "yamete", "yowaimo", "yoyowaimo"
];

const isNumber = x => !isNaN(x);

const handler = async (m, { conn, usedPrefix, text, command }) => {
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    const pp = await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom());
    const name = await conn.getName(who);

    if (!text) {
        let exampleUsage = `🎶 Contoh Penggunaan:\n${usedPrefix + command} 2\n\n🔢 List Nomor\nMaksimal Angka 70\n\nContoh:\n${usedPrefix + command} arigatou\n\n🔠 List Alphabet\n${soundAlphabets.map(item => `• ${item}`).join('\n')}`;
        if (command === 'mangkane') exampleUsage = `🎵 Contoh Penggunaan:\n${usedPrefix + command} 1`;
        if (command === 'ringtone') exampleUsage = `🎵 Contoh Penggunaan:\n${usedPrefix + command} black cover`;
        throw exampleUsage;
    }

    try {
        let vn, apiEndpoint;
        if (command === 'sound') {
            vn = isNumber(text) ? `https://raw.githubusercontent.com/AyGemuy/Sound/main/sound${text}.mp3` : `https://raw.githubusercontent.com/AyGemuy/HAORI-API/main/audio/${text}.mp3`;
            await conn.sendMessage(m.chat, {
                audio: { url: vn },
                ptt: true,
                mimetype: "audio/mpeg",
                fileName: "vn.mp3"
            }, { quoted: m });
        } else if (command === 'mangkane') {
            vn = `https://raw.githubusercontent.com/AyGemuy/Rest-Sound/main/HyuuraKane/mangkane${text}.mp3`;
            await conn.sendMessage(m.chat, {
                audio: { url: vn },
                ptt: true,
                mimetype: "audio/mpeg",
                fileName: "mangkane.mp3"
            }, { quoted: m });
        } else if (command === 'ringtone') {
            const response = await fetch(global.API('btchx', '/api/search/ringtone', { text: text }, 'apikey'));
            const result = await response.json();
            const listSections = Object.values(result.result).map((v, index) => ({
                title: v.title,
                id: `${usedPrefix + command}get ${v.audio}`,
                description: `Audio 🎧\n*Source:* ${v.source}`
            }));
            const formattedData = {
            title: "                *[ Sound Search ]*\n                 BEST MATCH\n\n",
            rows: [{
                    title: "Best",
                    highlight_label: "Best match",
                    rows: listSections
                }
            ]
        };
            await conn.sendButtonMessages(m.chat, [
            [`📺 Ringtone Search 🔎\n⚡ Silakan pilih Ringtone Search di bawah ini...\n\n*Teks yang anda kirim:* ${text}\n\nKetik ulang *${usedPrefix + command}* teks anda untuk mengubah teks lagi`, wm, null, [
                ], null, null,
                [
                    ["Result Here", formattedData.rows]
                ]
            ]
        ], m);
        } else if (command === 'ringtoneget') {
            await conn.sendFile(m.chat, text, 'ringtone.mp3', '', m);
        }
    } catch (error) {
        m.reply(`Maaf, terjadi kesalahan: ${error.message}`);
    }
};

handler.help = ['sound', 'mangkane', 'ringtone'];
handler.command = ['sound', 'mangkane', 'ringtone', 'ringtoneget'];
handler.tags = ['random'];

export default handler;
