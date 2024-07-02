import fetch from "node-fetch";
import cp, {
  exec as _exec
} from "child_process";
import {
  promisify
} from "util";
let exec = promisify(_exec).bind(cp);
const handler = async (m, {
  conn,
  usedPrefix,
  args,
  command
}) => {
  let type = (args[1] || "").toLowerCase(),
    _type = (args[1] || "").toLowerCase();
  if (!args[0]) return m.reply("Apikeynya mana?");
  let cek = "「🔎」ᴍᴇɴᴄᴀʀɪ ᴀᴘɪᴋᴇʏ...";
  try {
    if (/cekapi(key)?|cekkey/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count);
      switch (type) {
        case "xteam":
          if ("xteam" === type) {
            let xteam = await (await fetch(`https://api.xteam.xyz/cekey?APIKEY=${args[0]}`)).json().catch(v => "error");
            if (m.reply(cek), "error" === xteam) m.reply("Maaf restapi ini sedang error, harap coba lagi nanti");
            else {
              if ("Only alphanumeric!" === xteam.response) return m.reply("Only alphanumeric!");
              if ("Apikey tidak ditemukan, silahkan daftar atau beli ke developer untuk mendapatkan apikey yang valid!" === xteam.response) return m.reply("ɪɴᴠᴀʟɪᴅ ᴀᴘɪᴋᴇʏ !");
              await conn.reply(m.chat, `• *ᴛʏᴘᴇ:* XTEAM\n• *ᴀᴘɪᴋᴇʏ:* ${args[0]}\n\n• *ɴᴀᴍᴇ:* ${xteam.response.name}\n• *ɪᴘ:* ${xteam.response.ip}\n• *ᴇᴍᴀɪʟ:* ${xteam.response.email}\n• *ᴛᴏᴛᴀʟ ʜɪᴛ:* ${xteam.response.totalhit}\n• *ᴘʀᴇᴍɪᴜᴍ:* ${xteam.response.premium}\n\n• *ᴇxᴘɪʀᴇᴅ:* ${xteam.response.expired.replace("Premium left:", "")}`, m);
            }
          }
          break;
        case "lolhuman":
          let lol = await (await fetch(`https://api.lolhuman.xyz/api/checkapikey?apikey=${args[0]}`)).json();
          m.reply(cek), "success" === lol.message ? await conn.reply(m.chat, `• *ᴛʏᴘᴇ:* LOLHUMAN\n• *ᴀᴘɪᴋᴇʏ:* ${args[0]}\n\n• *ɴᴀᴍᴇ:* ${lol.result.username}\n• *ᴛᴏᴛᴀʟ ʜɪᴛ:* ${lol.result.requests}\n• *ʜɪᴛ ᴛᴏᴅᴀʏ:* ${lol.result.today}\n• *ᴀᴄᴄᴏᴜɴᴛ:* ${lol.result.account_type}\n\n• *ᴇxᴘɪʀᴇᴅ:* ${lol.result.expired}`, m) : m.reply("ɪɴᴠᴀʟɪᴅ ᴀᴘɪᴋᴇʏ !");
          break;
        case "openai":
          let o = await exec(`curl https://api.openai.com/v1/models   -H "Authorization: Bearer ${args[0]}"\n`),
            {
              stdout,
              stderr
            } = o,
            oexec = JSON.parse(stdout);
          m.reply(cek), oexec.error ? m.reply("ɪɴᴠᴀʟɪᴅ ᴀᴘɪᴋᴇʏ !") : await conn.reply(m.chat, `• *ᴛʏᴘᴇ:* OPENAI\n• *ᴀᴘɪᴋᴇʏ:* ${args[0]}\n\n• *Result:* ${oexec}`, m);
          break;
        default:
          return conn.sendButton(m.chat, `*${htki} CEK APIKEY ${htka}*`, "sᴇʟᴇᴄᴛ ᴛʏᴘᴇ ᴀᴘɪᴋᴇʏ ʜᴇʀᴇ!", null, [
            ["xᴛᴇᴀᴍ", `.cekapi ${args[0]} xteam`],
            ["ʟᴏʟʜᴜᴍᴀɴ", `.cekapi ${args[0]} lolhuman`],
            ["ᴏᴩᴇɴᴀɪ", `.cekapi ${args[0]} openai`]
          ], m);
      }
    } else if (/enchant|enchan/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count);
      switch (_type) {
        case "t":
        case "":
          break;
        default:
          return conn.sendButton(m.chat, wm, wm, null, ["⋮☰ Menu", ".menu"], m);
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack);
  }
};
handler.help = ["cekapikey"], handler.tags = ["internet", "tools"], handler.command = /^cek((api)?key|api)$/i;
export default handler;
