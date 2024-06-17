import { TrueLogin, TrueOtp, TrueSearch } from "../../lib/info/truecaller.js";
import chalk from "chalk";
const handler = async (m, { conn: conn, command: command, usedPrefix: usedPrefix, text: text }) => {
  if (conn.truecallerIds = conn.truecallerIds || {}, !text) return m.reply(`\n            Masukkan query. Contoh: ${usedPrefix + command} send number\n            Penggunaan:\n            ${usedPrefix + command} verify number key otp\n            ${usedPrefix + command} search number token\n        `.trim());
  try {
    let res, message = "";
    if ("truecaller" === command) {
      const [method, number, key, otp] = text.split(" ");
      if (method && number && ("send" === method && !otp || "verify" === method && key && otp || "search" === method && key)) switch (method) {
        case "send":
          res = await TrueLogin(number), message = JSON.stringify(res, null, 2);
          break;
        case "verify":
          res = await TrueOtp(number, key, otp), message = JSON.stringify(res, null, 2);
          break;
        case "search":
          res = await TrueSearch(number, key), message = JSON.stringify(res, null, 2);
          break;
        default:
          message = "ID eksternal tidak valid. ❌";
      } else message = "Format pesan tidak sesuai. Pastikan Anda telah memasukkan method, nomor, key, dan otp dengan benar. ❗";
    } else message = "Perintah tidak valid. ❌";
    m.reply(message);
  } catch (error) {
    console.error(chalk.red("Error:", error.message)), m.reply(`Error: ${error.message} ❌`);
  }
};
handler.help = ["truecaller"], handler.tags = ["ai"], handler.command = /^(truecaller)$/i;
export default handler;