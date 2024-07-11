import {
  Uploader
} from "../../lib/tools/uploader.js";
import _ from "lodash";
const upload = new Uploader();
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  args,
  text
}) => {
  const asyncFunctions = _(Object.getOwnPropertyNames(Object.getPrototypeOf(upload))).filter(prop => typeof upload[prop] === "function" && prop !== "constructor").map(func => [func, upload[func].bind(upload)]).fromPairs().value();
  const q = m.quoted ? m.quoted : m;
  if (!(q.msg || q).mimetype) throw "❌ Tidak ada media yang ditemukan.";
  const media = await q?.download();
  const asyncFunctionsList = _(Object.keys(asyncFunctions)).sort().map((func, index) => ` *${index + 1}.* ${func.charAt(0).toUpperCase() + func.slice(1)}`).join("\n");
  if (!text) {
    return m.reply(`ℹ️ *Daftar Fungsi Upload Link:*\n${asyncFunctionsList}\n\nℹ️ Gunakan format: ${usedPrefix + command} <urutan>\n\nℹ️ Contoh Penggunaan: ${usedPrefix + command} 1`);
  }
  try {
    const order = parseInt(text);
    if (isNaN(order) || order <= 0 || order > Object.keys(asyncFunctions).length) {
      return m.reply(`❌ Harap berikan nomor yang valid dari daftar fungsi.`);
    }
    const funcName = _(Object.keys(asyncFunctions)).sort().nth(order - 1);
    m.reply(`📤 *Mengunggah ke ${funcName?.toUpperCase()}...*`);
    const output = await asyncFunctions[funcName](media);
    const currentDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const reslink = typeof output === "object" ? _(output).map((value, key) => `  ○ *${key?.toUpperCase()}:* ${value}`).join("\n") : `🚀 *Link:* ${output}\n\n📁 *Provider:* ${funcName?.toUpperCase()}\n🕒 *Waktu:* ${currentDate}`;
    m.reply(reslink);
  } catch (error) {
    m.reply(`❌ Terjadi kesalahan: ${error.message}`);
  }
};
handler.help = ["upload type"];
handler.tags = ["tools"];
handler.command = /^(upload)$/i;
export default handler;
