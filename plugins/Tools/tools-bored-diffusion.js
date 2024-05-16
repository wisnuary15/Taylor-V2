import fetch from 'node-fetch';
import {
    FormData
} from 'formdata-node';

const modelOptions = [
    'stablediffusion',
    'midjourney',
    'pokemon'
];

const postData = async (index, input) => {
    try {
        const selectedmodel = modelOptions[index];
        const formData = new FormData();
        formData.append('prompt', encodeURIComponent(input));
        formData.append('model', encodeURIComponent(selectedmodel));
        formData.append('prompt_improver', 'true');
        const response = await fetch("https://boredhumans.com/api_text-to-image.php", {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Request failed with status code " + response.status);
        }
        const base64Data = await response.text();
        return JSON.parse(base64Data);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    try {
        let text;
        if (args.length >= 1) {
            text = args.slice(0).join(" ");
        } else if (m.quoted && m.quoted.text) {
            text = m.quoted.text;
        } else {
            console.log('Select a model by entering the corresponding number:');
            const modelList = modelOptions.map((model, index) => `${index + 1}. ${model}`);
            const listMessage = `Select a model:\n${modelList.join('\n')}`;
            await m.reply(listMessage);
            return;
        }

        await m.reply(wait);

        const inputArray = text.split('|');
        if (inputArray.length !== 2) {
            const errorMessage = 'Invalid input format. Please use "index|input".';
            await m.reply(errorMessage);
            const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
            await m.reply(helpMessage);
        } else {
            const selectedIndex = parseInt(inputArray[0]);
            const userInput = inputArray[1];

            if (!isNaN(selectedIndex) && selectedIndex >= 1 && selectedIndex <= modelOptions.length) {
                const result = await postData(selectedIndex - 1, userInput);
                const tag = `@${m.sender.split('@')[0]}`;
                await conn.sendMessage(m.chat, {
                    image: {
                        url: result.output
                    },
                    caption: `Nih effect *${modelOptions[selectedIndex - 1]}* nya\nRequest by: ${tag}`,
                    mentions: [m.sender]
                }, {
                    quoted: m
                });
            } else {
                const errorMessage = 'Invalid selection. Please enter a valid number.';
                await m.reply(errorMessage);
                const helpMessage = 'Please use the format: index|input. For example: 3|Hello';
                await m.reply(helpMessage);
            }
        }
    } catch (error) {
        console.error('Error in main code:', error);
        await m.reply(`Error: ${error}`);
    }
};

handler.help = ["boreddiff"];
handler.tags = ["tools"];
handler.command = /^(boreddiff)$/i;

export default handler;