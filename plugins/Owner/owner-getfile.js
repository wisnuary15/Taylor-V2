import cp from "child_process";
import { promisify } from "util";
let exec = promisify(cp.exec).bind(cp);
const handler = async (m, { conn: conn, isROwner: isROwner, usedPrefix: usedPrefix, command: command, text: text }) => {
  if (!text) throw `uhm.. teksnya mana?\n\ncontoh\n${usedPrefix + command} main`;
  let o;
  m.reply("Executing...");
  try {
    o = await exec("type " + text);
  } catch (e) {
    o = e;
  } finally {
    let { stdout: stdout, stderr: stderr } = o;
    stdout.trim() && m.reply(stdout), stderr.trim() && m.reply(stderr);
  }
};
handler.help = ["getfile"].map((v => v + " <text>")), handler.tags = ["owner"],
  handler.command = /^(getfile|gf)$/i, handler.rowner = !0;
export default handler;