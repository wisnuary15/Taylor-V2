import syntaxerror from "syntax-error";
import { format } from "util";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
const __dirname = dirname(fileURLToPath(import.meta.url)),
  require = createRequire(__dirname),
  baileys = require("@whiskeysockets/baileys"),
  handler = async (m, _2) => {
    let _return, { conn: conn, usedPrefix: usedPrefix, noPrefix: noPrefix, args: args, groupMetadata: groupMetadata } = _2,
      _syntax = "",
      _text = (/^=/.test(usedPrefix) ? "return " : "") + noPrefix,
      old = 1 * m.exp;
    try {
      let i = 15,
        f = {
          exports: {}
        },
        exec = new(async () => {}).constructor("print", "m", "handler", "require", "conn", "Array", "process", "args", "groupMetadata", "baileys", "module", "exports", "argument", _text);
      _return = await exec.call(conn, (async (...args) => {
        if (!(--i < 1)) return console.log(...args), await conn.reply(m.chat, format(...args), m);
      }), m, handler, require, conn, CustomArray, process, args, groupMetadata, baileys, f, f.exports, [conn, _2]);
    } catch (e) {
      let err = syntaxerror(_text, "Execution Function", {
        allowReturnOutsideFunction: !0,
        allowAwaitOutsideFunction: !0,
        sourceType: "module"
      });
      err && (_syntax = "```" + err + "```\n\n"), _return = e;
    } finally {
      await conn.reply(m.chat, _syntax + format(_return), m), m.exp = old;
    }
  };
handler.customPrefix = /^=?> /, handler.command = new RegExp, handler.rowner = !0;
export default handler;
class CustomArray extends Array {
  constructor(...args) {
    return "number" == typeof args[0] ? super(Math.min(args[0], 1e4)) : super(...args);
  }
}