import fetch from "node-fetch";
import {
  sticker
} from "../../lib/sticker.js";
const handler = async (m, {
  conn
}) => {
  let res = await fetch(API("https://api.waifu.pics", "/sfw/cry")),
    json = await res.json(),
    stiker = await sticker(null, json.url, packname, author);
  if (stiker) return await conn.sendFile(m.chat, stiker, "sticker.webp", "", m, !1, {
    asSticker: !0
  });
  throw stiker.toString();
};
handler.help = ["stickercry"], handler.tags = ["sticker"], handler.command = /^cry|stickercry|stikercry$/i,
  handler.limit = !0;
export default handler;
