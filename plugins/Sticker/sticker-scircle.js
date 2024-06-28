import uploadImage from "../../lib/uploadImage.js";
import {
  sticker
} from "../../lib/sticker.js";
const handler = async (m, {
  conn,
  text
}) => {
  try {
    let q = m.quoted ? m.quoted : m,
      img = ((q.msg || q).mimetype, await q?.download()),
      url = await uploadImage(img),
      scircle = API("dzx", "/api/canvas/circle", {
        url: url
      }),
      stiker = await sticker(null, scircle, packname, m.name);
    await conn.sendFile(m.chat, stiker, "sticker.webp", "", m, {
      asSticker: !0
    });
  } catch (e) {
    m.reply("*[❗𝐈𝐍𝐅𝐎❗] respond to a image to make it circle sticker*");
  }
};
handler.command = /^scircle$/i;
export default handler;