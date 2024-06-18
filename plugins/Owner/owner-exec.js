import syntaxerror from "syntax-error";
import { format } from "util";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const baileys = require("@whiskeysockets/baileys");

const handler = async (m, { conn, usedPrefix, noPrefix, args, groupMetadata }) => {
  let _return, _syntax = "";
  const _text = (/^=>/.test(usedPrefix) ? "return " : "") + noPrefix;
  const oldExp = m.exp;

  try {
    const exec = new Function("print", "m", "handler", "require", "conn", "Array", "process", "args", "groupMetadata", "baileys", "module", "exports", "argument", _text);
    _return = await exec.call(conn, async (...args) => {
      if (--i < 1) return;
      console.log(...args);
      await conn.reply(m.chat, format(...args), m);
    }, m, handler, require, conn, CustomArray, process, args, groupMetadata, baileys, {}, {});
  } catch (e) {
    const err = syntaxerror(_text, "Execution Function", {
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      sourceType: "module"
    });
    if (err) _syntax = "```" + err + "```\n\n";
    _return = e;
  } finally {
    await conn.reply(m.chat, _syntax + format(_return), m);
    m.exp = oldExp;
  }
};

handler.customPrefix = /^=>? /;
handler.command = new RegExp();
handler.rowner = true;

export default handler;

class CustomArray extends Array {
  constructor(...args) {
    super(...(typeof args[0] === "number" ? [Math.min(args[0], 10000)] : args));
  }
}
