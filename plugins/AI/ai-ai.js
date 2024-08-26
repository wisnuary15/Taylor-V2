import {
  AI
} from "../../lib/ai/aichat.js";
import _ from "lodash";
const aiClient = new AI();
const commands = [{
  command: "cgtai",
  method: "CgtAi",
  help: "cgtai",
  isJson: false
}, {
  command: "goodyai",
  method: "GoodyAI",
  help: "goodyai",
  isJson: false
}, {
  command: "leptonai",
  method: "leptonAi",
  help: "leptonai",
  isJson: false
}, {
  command: "letmegpt",
  method: "LetmeGpt",
  help: "letmegpt",
  isJson: false
}, {
  command: "thinkany",
  method: "thinkany",
  help: "thinkany",
  isJson: false
}, {
  command: "useadrenaline",
  method: "useadrenaline",
  help: "useadrenaline",
  isJson: false
}, {
  command: "degreeguru",
  method: "degreeguru",
  help: "degreeguru",
  isJson: false
}, {
  command: "ragbot",
  method: "ragbot",
  help: "ragbot",
  isJson: false
}, {
  command: "stoicai",
  method: "stoicai",
  help: "stoicai",
  isJson: false
}, {
  command: "stoicgpt",
  method: "stoicgpt",
  help: "stoicgpt",
  isJson: false
}, {
  command: "alicia",
  method: "alicia",
  help: "alicia",
  isJson: false
}, {
  command: "cairo",
  method: "cairo",
  help: "cairo",
  isJson: false
}, {
  command: "omniplex",
  method: "omniplexAi",
  help: "omniplex",
  isJson: true
}];
const handler = async (m, {
  args,
  command,
  usedPrefix,
  conn
}) => {
  const matchedCommand = _.find(commands, cmd => cmd.command.toLowerCase() === command.toLowerCase());
  if (!matchedCommand) return;
  if (!db.data.dbai.multiai) db.data.dbai.multiai = {};
  const text = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${matchedCommand.help} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const aiResponse = await aiClient[matchedCommand.method](encodeURIComponent(text));
    const {
      key: {
        id: keyId
      }
    } = await conn.reply(m.chat, matchedCommand.isJson ? aiResponse.data : aiResponse, m);
    db.data.dbai.multiai[m.sender] = {
      key: {
        id: keyId
      },
      cmd: matchedCommand
    };
    m.react(sukses);
  } catch (error) {
    console.error("Error:", error);
    m.react(eror);
  }
};
handler.before = async (m, {
  conn
}) => {
  if (!db.data.dbai.multiai || m.isBaileys || !(m.sender in db.data.dbai.multiai)) return;
  const {
    key: {
      id: keyId
    },
    cmd
  } = db.data.dbai.multiai[m.sender];
  if (m.quoted?.id === keyId && cmd && m.text.trim()) {
    m.react(wait);
    try {
      const aiResponse = await aiClient[cmd.method](encodeURIComponent(m.text.trim()));
      const {
        key: {
          id: newKeyId
        }
      } = await conn.reply(m.chat, cmd.isJson ? aiResponse.data : aiResponse, m);
      db.data.dbai.multiai[m.sender].key.id = newKeyId;
      m.react(sukses);
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.tags = ["ai"];
handler.command = new RegExp(`^(${commands.map(cmd => cmd.command).join("|")})$`, "i");
handler.help = commands.map(cmd => cmd.help);
export default handler;