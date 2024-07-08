import uploadFile from "../../lib/uploadFile.js";
import uploadImage from "../../lib/uploadImage.js";
import {
  webp2png
} from "../../lib/webp2mp4.js";
import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  var out;
  let q = m.quoted ? m.quoted : m,
    mime = (q.msg || q).mimetype || q.mediaType || "";
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply("Maksimal 10 detik!");
  if (!/webp|image|video|gif|viewOnce/g.test(mime)) return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command}`);
  let img = await q?.download();
  /webp/g.test(mime) ? out = await webp2png(img) : /image/g.test(mime) ? out = await uploadImage(img) : (/video/g.test(mime) || /gif/g.test(mime) || /viewOnce/g.test(mime)) && (out = await uploadFile(img)),
    m.react(wait);
  try {
    let res;
    res = args[0] ? await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + out + "&language=" + args[0])).json() : await (await fetch("https://api.ocr.space/parse/imageurl?apikey=helloworld&url=" + out)).json(),
      m.reply("*Result:*\n\n" + res.ParsedResults[0]?.ParsedText);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["ocr"], handler.tags = ["tools"], handler.command = /^ocr$/i;
export default handler;
