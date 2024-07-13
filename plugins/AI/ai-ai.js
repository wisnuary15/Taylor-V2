import {
  AI
} from "../../lib/ai/aichat.js";
const aiClient = new AI();
const handler = async (m, {
  args,
  command,
  usedPrefix
}) => {
  const commands = [{
    regex: /^(cgtai)$/i,
    method: "CgtAi",
    help: "cgtai"
  }, {
    regex: /^(goodyai)$/i,
    method: "GoodyAI",
    help: "goodyai"
  }, {
    regex: /^(leptonai)$/i,
    method: "leptonAi",
    help: "leptonai"
  }, {
    regex: /^(letmegpt)$/i,
    method: "LetmeGpt",
    help: "letmegpt"
  }, {
    regex: /^(thinkany)$/i,
    method: "thinkany",
    help: "thinkany"
  }, {
    regex: /^(useadrenaline)$/i,
    method: "useadrenaline",
    help: "useadrenaline"
  }];
  const matchedCommand = commands.find(cmd => cmd.regex.test(command));
  if (!matchedCommand) return m.reply(`Command tidak dikenali. Gunakan salah satu dari: ${commands.map(cmd => cmd.help).join(", ")}.`);
  const text = args.length >= 1 ? args.join(" ") : m.quoted && (m.quoted.text || m.quoted.caption || m.quoted.description) || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${matchedCommand.help} Hai, apa kabar?*`);
  m.react(wait);
  const messages = encodeURIComponent(text);
  try {
    const chatGPTResponse = await aiClient[matchedCommand.method](messages);
    m.reply(chatGPTResponse);
  } catch (error) {
    console.error("Error:", error);
    m.react("eror");
  }
};
handler.tags = ["ai"];
handler.command = /^(cgtai|goodyai|leptonai|letmegpt|thinkany|useadrenaline)$/i;
handler.help = ["cgtai", "goodyai", "leptonai", "letmegpt", "thinkany", "useadrenaline"];
export default handler;
