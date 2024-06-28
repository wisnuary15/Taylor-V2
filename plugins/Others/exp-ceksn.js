import {
  createHash
} from "crypto";
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;
const handler = async (m, {
  text,
  usedPrefix,
  command
}) => {
  let sn = createHash("md5").update(m.sender).digest("hex");
  await conn.sendButtonMessages(m.chat, [[`*📮 SN:* ${sn}`, "Use .unreg [sn] for Un-Register", null, [], [["COPY SN", sn]], null, null]], m), m.isGroup && await conn.sendButtonMessages(m.sender, [[`*📮 SN:* ${sn}`, "Use .unreg [sn] for Un-Register", null, [], [["COPY SN", sn]], null, null]], m);
};
handler.help = ["ceksn"], handler.tags = ["xp"], handler.command = /^(ceksn|sn)$/i,
  handler.register = !0;
export default handler;