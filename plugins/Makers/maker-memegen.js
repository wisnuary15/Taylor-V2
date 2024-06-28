import fetch from "node-fetch";
import uploadImage from "../../lib/uploadImage.js";
import {
  sticker
} from "../../lib/sticker.js";
import wibusoft from "wibusoft";
const getFonts = async () => {
  let res = await fetch("https://api.memegen.link/fonts", {
      headers: {
        accept: "application/json"
      }
    }),
    fonts = await res.json();
  return Object.values(fonts).map(v => v.id).getRandom();
}, createTemplate = async (bg, atas, bawah, font) => {
  let res = await fetch("https://api.memegen.link/templates/custom", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      background: bg,
      text: [encodeURIComponent(atas || ""), encodeURIComponent(bawah || "")],
      font: font,
      extension: "png"
    })
  });
  return await res.json();
}, createImage = async (bg, atas, bawah, font) => {
  let res = await fetch("https://api.memegen.link/images/custom", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      background: bg,
      text: [encodeURIComponent(atas || ""), encodeURIComponent(bawah || "")],
      font: font,
      extension: "png"
    })
  });
  return await res.json();
}, handler = async (m, {
  conn,
  usedPrefix,
  text,
  command
}) => {
  let [atas, bawah] = text.split(/[^\w\s]/g), q = m.quoted ? m.quoted : m, image = await q?.download(), mime = (q.msg || q).mimetype || q.mediaType || "";
  if (!/image|viewOnce/g.test(mime)) return m.reply(`Reply Media dengan perintah\n\n${usedPrefix + command} <${atas || "teks atas"}>|<${bawah || "teks bawah"}>`);
  m.react(wait);
  try {
    let bg = await uploadImage(image),
      font = await getFonts(),
      json = await createTemplate(bg, atas, bawah, font);
    try {
      let out = await wibusoft.tools.makeSticker(json.url, {
        author: packname,
        pack: m.name,
        keepScale: !0
      });
      m.reply(out);
    } catch (e) {
      let stick = await sticker(!1, json.url, m.name, packname);
      await conn.sendFile(m.chat, stick, "memegen.webp", "", m);
    }
  } catch (e) {
    try {
      let bg = await uploadImage(image),
        font = await getFonts(),
        json = await createImage(bg, atas, bawah, font),
        out = await wibusoft.tools.makeSticker(json.url, {
          author: packname,
          pack: m.name,
          keepScale: !0
        });
      m.reply(out);
    } catch (e) {
      let stick = await sticker(!1, json.url, m.name, packname);
      await conn.sendFile(m.chat, stick, "memegen.webp", "", m);
    }
  }
};
handler.help = ["memegen"], handler.tags = ["maker"], handler.command = /^(memegen)$/i;
export default handler;