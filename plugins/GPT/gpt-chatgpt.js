import fetch from "node-fetch";
import cheerio from "cheerio";

let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    
    try {
        let res = await bardaifree(text)
        await m.reply(res)
    } catch (e) {
        try {
            let res = await chatgptss(text)
            await m.reply(res)
        } catch (e) {
            try {
            let res = await bartai(text)
            await m.reply(res)
        } catch (e) {
            await m.reply(eror)
        }
        }
    }
}
handler.help = ["chatgpt"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(chatgpt)$/i

export default handler

/* New Line */
async function processChat(baseLink, message) {
    try {
        const html = await (await fetch(baseLink)).text();
        const $ = cheerio.load(html);

        const info = $('.wpaicg-chat-shortcode').map((index, element) => {
            return Object.fromEntries(Object.entries(element.attribs));
        }).get();
        
        const data = new FormData();
        data.append('_wpnonce', info[0]['data-nonce']);
        data.append('post_id', info[0]['data-post-id']);
        data.append('action', 'wpaicg_chatbox_message');
        data.append('message', message);
        const response = await fetch(baseLink + '/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: data
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const { data } = await response.json();

        return data || '';
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}

async function chatgptss(message) {
    try {
        const data = await processChat('https://chatgptss.org', message);
        return data;
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}

async function bardaifree(message) {
    try {
        const data = await processChat('https://bardaifree.com', message);
        return data;
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}

async function bartai(message) {
    try {
        const data = await processChat('https://bartai.org', message);
        return data;
    } catch (error) {
        console.error('An error occurred:', error.message);
        throw error;
    }
}