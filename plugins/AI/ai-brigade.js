import {
    BotBrigade
} from '../../lib/ai/brigade.js';
import chalk from 'chalk';

const handler = async (m, {
    conn,
    command,
    usedPrefix,
    args
}) => {
    conn.brigadeIds = conn.brigadeIds || {};
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) return m.reply(`
            Input query. Example: ${usedPrefix}brigade hello
            Usage:
            ${usedPrefix}brigade <message> - Send message using saved external ID.
            ${usedPrefix}brigadeset <external_id> - Set external ID for .brigade command.
        `);

    const apiClient = new BotBrigade();

    try {
        let message = '';

        if (command === 'brigade') {
            message = conn.brigadeIds[m.chat] ? ((await apiClient.ReqChat(conn.brigadeIds[m.chat], text)).response ?? 'No reply from AI.') : 'No external ID set. Use .brigadeset command to set external ID. ❗';
        } else if (command === 'brigadeset') {
            if (!text) {
                message = `Please provide an external ID to set. Example: ${usedPrefix}brigadeset your_external_id`;
            } else {
                const brigadeList = ["Anies-Imin", "Prabowo-Gibran", "Ganjar-Mahfud"];
                const brigadeOptions = brigadeList.map((brigade, index) => `${index + 1}. ${brigade}`).join('\n');
                const index = parseInt(text.trim()) - 1;
                if (index >= 0 && index < brigadeList.length) {
                    conn.brigadeIds[m.chat] = brigadeList[index];
                    message = 'External ID set successfully! ✅';
                } else {
                    message = `Invalid index. Please select a valid index from the list:\n${brigadeOptions}`;
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

handler.help = ["brigade", "brigadeset"];
handler.tags = ["ai"];
handler.command = /^(brigade|brigadeset)$/i;

export default handler;