import {
    Arya
} from '../../lib/ai/arya-hcr.js';
import chalk from 'chalk';

const handler = async (m, {
    conn,
    command,
    usedPrefix,
    text
}) => {
    conn.hcrIds = conn.hcrIds || {};

    if (!text) {
        return m.reply(`
            Input query. Example: ${usedPrefix + command} hello
            Usage:
            ${usedPrefix + command} <message> - Send message using saved external ID.
            ${usedPrefix + command} <external_id> - Set external ID for .${command} command.
        `.trim());
    }

    const apiClient = new Arya();

    try {
        let message = '';
        let res;

        if (command === 'hcr') {
            const externalId = conn.hcrIds[m.chat];
            if (externalId) {
                switch (externalId) {
                    case 'stablediffusion15':
                        res = await apiClient.stablediffusion15(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'stablediffusion21':
                        res = await apiClient.stablediffusion21(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'stablediffusionXL':
                        res = await apiClient.stablediffusionXL(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'pixartA':
                        res = await apiClient.pixartA(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'pixartLcm':
                        res = await apiClient.pixartLcm(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'dalle':
                        res = await apiClient.dalle(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'dalleMini':
                        res = await apiClient.dalleMini(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'prodia':
                        res = await apiClient.prodia(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'prodiaStablediffusion':
                        res = await apiClient.prodiaStablediffusion(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'prodiaStablediffusionXL':
                        res = await apiClient.prodiaStablediffusionXL(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'emi':
                        res = await apiClient.emi(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'chatGPT':
                        res = await apiClient.chatGPT(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'chatComplements':
                        res = await apiClient.chatComplements(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    case 'translate':
                        res = await apiClient.translate(text);
                        message = JSON.stringify(res, null, 2)
                        break;
                    default:
                        message = 'Invalid external ID. ❌';
                        break;
                }
            } else {
                message = 'No external ID set. Use .hcrset command to set external ID. ❗';
            }
        } else if (command === 'hcrset') {
            if (!text) {
                message = `Please provide an external ID to set. Example: ${usedPrefix}hcrset your_external_id`;
            } else {
                const hcrList = ["stablediffusion15", "stablediffusion21", "stablediffusionXL", "pixartA", "pixartLcm", "dalle", "dalleMini", "prodia", "prodiaStablediffusion", "prodiaStablediffusionXL", "emi", "chatGPT", "chatComplements", "translate"];
                const hcrOptions = hcrList.map((hcr, index) => `${index + 1}. ${hcr}`).join('\n');
                const index = parseInt(text.trim()) - 1;
                if (index >= 0 && index < hcrList.length) {
                    conn.hcrIds[m.chat] = hcrList[index];
                    message = `External ID set successfully to ${hcrList[index]}! ✅`;
                } else {
                    message = `Invalid index. Please select a valid index from the list:\n${hcrOptions}`;
                }
            }
        } else {
            message = 'Invalid command. ❌';
        }

        await m.reply(message);
    } catch (error) {
        console.error(chalk.red('Error:', error.message));
        await m.reply(`Error: ${error.message} ❌`);
    }
};

handler.help = ["hcr", "hcrset"];
handler.tags = ["ai"];
handler.command = /^(hcr|hcrset)$/i;

export default handler;