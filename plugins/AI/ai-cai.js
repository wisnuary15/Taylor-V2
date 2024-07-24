import {
  ApiGratis
} from "../../lib/ai/api-gratis.js";
import chalk from "chalk";
const handler = async (m, {
  conn,
  command,
  usedPrefix,
  args
}) => {
  conn.externalIds = conn.externalIds || {};
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`\n            Input query. Example: ${usedPrefix}cai hello\n            Usage:\n            ${usedPrefix}caiinfo <external_id> - Get character info by external ID.\n            ${usedPrefix}caisearch <query> - Search character by query.\n            ${usedPrefix}caistats - Get status.\n            ${usedPrefix}cai <message> - Send message using saved external ID.\n            ${usedPrefix}caiset <external_id> - Set external ID for .cai command.\n        `);
  const apiClient = new ApiGratis();
  try {
    let message = "";
    if ("caiinfo" === command) {
      const characterInfo = (await apiClient.getCharacterInfo(text)).result.character;
      message = characterInfo ? formatCharacterInfo(characterInfo) : "Character info not found.";
    } else if ("caistats" === command) {
      const status = (await apiClient.getStatus()).result;
      message = "ok" === status.status ? formatStatus(status) : "Status not found.";
    } else if ("cai" === command) message = conn.externalIds[m.chat] ? (await apiClient.sendMessage(conn.externalIds[m.chat], text)).result.replies[0]?.text ?? "No reply from AI." : "No external ID set. Use .caiset command to set external ID. ❗";
    else if ("caisearch" === command) {
      const searchResults = (await apiClient.searchCharacters(text)).result.characters;
      message = searchResults ? formatSearchResults(searchResults) : "Search results not found.";
    } else "caiset" === command ? text ? (conn.externalIds[m.chat] = text.trim(), message = "External ID set successfully! ✅") : message = `Please provide an external ID to set. Example: ${usedPrefix}caiset your_external_id` : message = "Invalid command. ❌";
    m.reply(message);
  } catch (error) {
    console.error(chalk.red("Error:", error.message)), m.reply(`Error: ${error.message} ❌`);
  }
};
handler.help = ["cai", "caiinfo", "caistats", "caiset", "caisearch"], handler.tags = ["ai"],
  handler.command = /^(cai|caiinfo|caistats|caiset|caisearch)$/i;
export default handler;

function formatCharacterInfo(character) {
  const {
    title,
    name,
    visibility,
    greeting,
    avatar_file_name,
    participant__num_interactions,
    user__username,
    priority,
    search_score
  } = character;
  return `*Title:* ${title}\n*Name:* ${name}\n*Visibility:* ${visibility}\n*Greeting:* ${greeting}\n*Avatar:* ${avatar_file_name}\n*Participant Interactions:* ${participant__num_interactions}\n*User Username:* ${user__username}\n*Priority:* ${priority}\n*Search Score:* ${search_score}`;
}

function formatStatus(status) {
  const {
    version,
    cai_status
  } = status;
  return `*Status:* OK\n*Version:* ${version}\n*Authenticated:* ${cai_status.is_authenticated ? "Yes" : "No"}\n*Browser Launched:* ${cai_status.browser_launched ? "Yes" : "No"}`;
}

function formatSearchResults(characters) {
  return characters.slice(0, 10).map((char, index) => `*${index + 1}.* ${char.title}\n   *Name:* ${char.participant__name}\n   *ExternalID:* ${char.external_id}\n   *Greeting:* ${char.greeting}\n   *Visibility:* ${char.visibility}\n   *Participant Interactions:* ${char.participant__num_interactions}\n   *User Username:* ${char.user__username}\n   *Priority:* ${char.priority}\n   *Search Score:* ${char.search_score}`).join("\n\n");
}