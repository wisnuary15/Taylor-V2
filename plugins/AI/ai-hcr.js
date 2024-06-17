import { Arya } from "../../lib/ai/arya-hcr.js";
import chalk from "chalk";
const handler = async (m, { conn: conn, command: command, usedPrefix: usedPrefix, args: args }) => {
  conn.hcrIds = conn.hcrIds || {};
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`\n            Input query. Example: ${usedPrefix + command} hello\n            Usage:\n            ${usedPrefix}hcr <message> - Send message using saved external ID.\n            ${usedPrefix}hcrset <external_id> - Set external ID for .${command} command.\n        `);
  const apiClient = new Arya;
  try {
    let res, message = "";
    if ("hcr" === command) {
      const externalId = conn.hcrIds[m.chat];
      if (externalId) switch (externalId) {
        case "stablediffusion15":
          res = await apiClient.stablediffusion15(text), message = JSON.stringify(res, null, 2);
          break;
        case "stablediffusion21":
          res = await apiClient.stablediffusion21(text), message = JSON.stringify(res, null, 2);
          break;
        case "stablediffusionXL":
          res = await apiClient.stablediffusionXL(text), message = JSON.stringify(res, null, 2);
          break;
        case "pixartA":
          res = await apiClient.pixartA(text), message = JSON.stringify(res, null, 2);
          break;
        case "pixartLcm":
          res = await apiClient.pixartLcm(text), message = JSON.stringify(res, null, 2);
          break;
        case "dalle":
          res = await apiClient.dalle(text), message = JSON.stringify(res, null, 2);
          break;
        case "dalleMini":
          res = await apiClient.dalleMini(text), message = JSON.stringify(res, null, 2);
          break;
        case "prodia":
          res = await apiClient.prodia(text), message = JSON.stringify(res, null, 2);
          break;
        case "prodiaStablediffusion":
          res = await apiClient.prodiaStablediffusion(text), message = JSON.stringify(res, null, 2);
          break;
        case "prodiaStablediffusionXL":
          res = await apiClient.prodiaStablediffusionXL(text), message = JSON.stringify(res, null, 2);
          break;
        case "emi":
          res = await apiClient.emi(text), message = JSON.stringify(res, null, 2);
          break;
        case "chatGPT":
          res = await apiClient.chatGPT(text), message = JSON.stringify(res, null, 2);
          break;
        case "chatComplements":
          res = await apiClient.chatComplements(text), message = JSON.stringify(res, null, 2);
          break;
        case "translate":
          res = await apiClient.translate(text), message = JSON.stringify(res, null, 2);
          break;
        default:
          message = "Invalid external ID. ❌";
      } else message = "No external ID set. Use .hcrset command to set external ID. ❗";
    } else if ("hcrset" === command)
      if (text) {
        const hcrList = ["stablediffusion15", "stablediffusion21", "stablediffusionXL", "pixartA", "pixartLcm", "dalle", "dalleMini", "prodia", "prodiaStablediffusion", "prodiaStablediffusionXL", "emi", "chatGPT", "chatComplements", "translate"],
          hcrOptions = hcrList.map(((hcr, index) => `${index + 1}. ${hcr}`)).join("\n"),
          index = parseInt(text.trim()) - 1;
        index >= 0 && index < hcrList.length ? (conn.hcrIds[m.chat] = hcrList[index], message = `External ID set successfully to ${hcrList[index]}! ✅`) : message = `Invalid index. Please select a valid index from the list:\n${hcrOptions}`;
      } else message = `Please provide an external ID to set. Example: ${usedPrefix}hcrset your_external_id`;
    else message = "Invalid command. ❌";
    m.reply(message);
  } catch (error) {
    console.error(chalk.red("Error:", error.message)), m.reply(`Error: ${error.message} ❌`);
  }
};
handler.help = ["hcr", "hcrset"], handler.tags = ["ai"], handler.command = /^(hcr|hcrset)$/i;
export default handler;