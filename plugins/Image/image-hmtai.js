import fetch from "node-fetch";
import {
  Sticker,
  StickerTypes
} from "wa-sticker-formatter";
import hmtai from "hmtai";
const Hmtai = new hmtai(),
  handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
  }) => {
    let ends = ["sfw", "nsfw"],
      Sfw = Object.keys(Hmtai.sfw),
      Nsfw = Object.keys(Hmtai.nsfw),
      [modes, kodes] = text.split(/[^\w\s]/g);
    if (!ends.includes(modes)) return m.reply("*Example:*\n.hmtai sfw|wave\n\n*Pilih type yg ada*\n" + ends.map((v, index) => "  ○ " + v).join("\n"));
    if (ends.includes(modes)) {
      if (Number(kodes)) return m.reply("Text only!");
      if ("sfw" === modes) {
        if (!Sfw.includes(kodes)) return m.reply("*Example:*\n.hmtai sfw|wave\n\n*Pilih type yg ada*\n" + Sfw.map((v, index) => "  ○ " + v).join("\n"));
        m.react(wait);
        let outs = await Hmtai[modes][kodes](),
          stiker = await createSticker(!1, outs, modes, kodes, 30);
        m.reply(stiker);
      }
      if ("nsfw" === modes) {
        if (!Nsfw.includes(kodes)) return m.reply("*Example:*\n.hmtai nsfw|pussy\n\n*Pilih type yg ada*\n" + Nsfw.map((v, index) => "  ○ " + v).join("\n"));
        m.react(wait);
        let outs = await Hmtai[modes][kodes](),
          stiker = await createSticker(!1, outs, modes, kodes, 30);
        m.reply(stiker);
      }
    }
  };
handler.help = ["hmtai type query"], handler.tags = ["internet"], handler.command = /^(hmtai)$/i;
export default handler;
async function createSticker(img, url, packName, authorName, quality) {
  return new Sticker(img || url, {
    type: "full",
    pack: packName,
    author: authorName,
    quality: quality
  }).toBuffer();
}