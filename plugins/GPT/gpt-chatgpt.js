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
        const messages = [{
                role: "system",
                content: "Anda adalah asisten yang membantu."
            },
            {
                role: "user",
                content: text
            }
        ];

        const output = await ChatGpt(messages[0].content, messages[1].content);
        await m.reply(output)
    } catch (e) {
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

        const formData = new FormData();
        formData.append('_wpnonce', info[0]['data-nonce']);
        formData.append('post_id', info[0]['data-post-id']);
        formData.append('action', 'wpaicg_chatbox_message');
        formData.append('message', message);
        const response = await fetch(baseLink + '/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const {
            data
        } = await response.json();

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

async function ChatGpt(system, prompt) {
    try {
        const host = "47.116.100.195";
        const port = "188";

        const requestOptions = {
            method: 'POST',
            headers: {
                'Host': host,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Content-Type': 'application/json',
                'Origin': 'http://47.116.100.195'
            },
            body: JSON.stringify({
                prompt,
                network: true,
                system,
                withoutContext: false,
                stream: false
            })
        };

        const response = await fetch(`http://${host}:${port}/api/generateStream`, requestOptions);
        const data = await response.text();
        return data;
    } catch (error) {
        throw new Error("Error fetching data from AI service.");
    }
}