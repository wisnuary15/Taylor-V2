import { createHash } from "crypto";
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;
const handler = async (m, { text: text, usedPrefix: usedPrefix, command: command }) => {
  let sn = createHash("md5").update(m.sender).digest("hex");
  m.reply(`*📮 SN:* ${sn}`), m.isGroup && await conn.reply(m.sender, `*📮 SN:* ${sn}`, m);
};
handler.help = ["ceksn"], handler.tags = ["xp"], handler.command = /^(ceksn)$/i,
  handler.register = !0;
export default handler;