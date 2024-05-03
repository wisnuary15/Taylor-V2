import fetch from "node-fetch";

let handler = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    try {
        if (command === "promptgen") {
            const concept = text || 'best';
            const data = await getArtList(concept);
            await conn.reply(m.chat, data, m);
        } else {
            const concept = text || 'best';
            const data = await getArtList(concept);

            if (!data || !data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                throw new Error("Invalid response format");
            }

            const artListText = JSON.parse(data.candidates[0].content.parts[0].text);

            const sortedArtListMessage = ["*Art List*",
                ...artListText
                .sort((a, b) => a.prompt.localeCompare(b.prompt))
                .map((artObject, index) => ({
                    index: index + 1,
                    prompt: `*${index + 1}.* ${artObject.prompt}`,
                    keywords: `*Keywords:* ${artObject.keywords.map(keyword => `_${keyword}_`).join(', ')}`
                }))
                .map(({
                    prompt,
                    keywords
                }) => `${prompt}\n${keywords}\n`)
            ].join('\n');

            await conn.reply(m.chat, sortedArtListMessage, m);
        }
    } catch (error) {
        console.error(`Handler error: ${error.message}`);
        await conn.reply(m.chat, "An error occurred. Please try again later.", m);
    }
};

handler.help = ["prompts", "promptgen"];
handler.tags = ["ai"];
handler.command = /^(prompts|promptgen)$/i;
export default handler;

const getArtList = async (concept) => {
    try {
        const apiUrl = `https://aiart.manigopalmurthy.workers.dev/prompts?count=10&concept=${concept}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        return null;
    }
};

const promptGen = async (concept) => {
    try {
        const apiUrl = `https://www.api.vyturex.com/promptgen?content=${concept}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        return null;
    }
};