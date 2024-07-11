import fetch from "node-fetch";
import {
  Sticker,
  StickerTypes
} from "wa-sticker-formatter";
import hmfull from "hmfull";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  let ends = ["sfw", "nsfw"],
    typs = ["HMtai", "NekoBot", "NekoLove", "Nekos"],
    Hsfw = Object.keys(hmfull.HMtai.sfw),
    Nesfw = Object.keys(hmfull.NekoBot.sfw),
    Nelsfw = Object.keys(hmfull.NekoLove.sfw),
    Neksfw = Object.keys(hmfull.Nekos.sfw),
    Sfw = Hsfw.concat(Nesfw, Nelsfw, Neksfw),
    Hnsfw = Object.keys(hmfull.HMtai.nsfw),
    Nensfw = Object.keys(hmfull.NekoBot.nsfw),
    Nelnsfw = Object.keys(hmfull.NekoLove.nsfw),
    Neknsfw = Object.keys(hmfull.Nekos.nsfw),
    Nsfw = Hnsfw.concat(Nensfw, Nelnsfw, Neknsfw),
    [types, modes, kodes] = text.split(/[^\w\s]/g);
  if (!typs.includes(types)) return m.reply("*Example:*\n.hmfull Nekos|sfw|waifu\n\n*Pilih type yg ada*\n" + typs.map((v, index) => "  ○ " + v).join("\n"));
  if (typs.includes(types)) {
    if (!ends.includes(modes)) return m.reply("*Example:*\n.hmfull Nekos|sfw|waifu\n\n*Pilih type yg ada*\n" + ends.map((v, index) => "  ○ " + v).join("\n"));
    if (ends.includes(modes)) {
      if (Number(kodes)) return m.reply("Text only!");
      if ("sfw" === modes) {
        if (!Sfw.includes(kodes)) return m.reply("*Example:*\n.hmfull Nekos|sfw|waifu\n\n*Pilih type yg ada*\n" + Sfw.map((v, index) => "  ○ " + v).join("\n"));
        m.react(wait);
        let outs = await hmfull[types][modes][kodes](),
          stiker = await createSticker(!1, outs.url, modes, kodes, 30);
        m.reply(stiker);
      }
      if ("nsfw" === modes) {
        if (!Nsfw.includes(kodes)) return m.reply("*Example:*\n.hmfull nsfw|pussy\n\n*Pilih type yg ada*\n" + Nsfw.map((v, index) => "  ○ " + v).join("\n"));
        m.react(wait);
        let outs = await hmfull[types][modes][kodes](),
          stiker = await createSticker(!1, outs.url, modes, kodes, 30);
        m.reply(stiker);
      }
    }
  }
};
handler.help = ["hmfull type query"], handler.tags = ["internet"], handler.command = /^(hmfull)$/i;
export default handler;
async function createSticker(img, url, packName, authorName, quality) {
  return new Sticker(img || url, {
    type: "full",
    pack: packName,
    author: authorName,
    quality: quality
  }).toBuffer();
}
