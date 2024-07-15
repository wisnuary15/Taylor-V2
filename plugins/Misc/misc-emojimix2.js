import {
  sticker
} from "../../lib/sticker.js";
import fetch from "node-fetch";
import fs from "fs";
import {
  Sticker,
  StickerTypes
} from "wa-sticker-formatter";
import wibusoft from "wibusoft";
const handler = async (m, {
  conn,
  text,
  args,
  usedPrefix,
  command
}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender,
    name = (await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom()), conn.getName(who)),
    [a, b, c] = text.split(/[xzXZ/i!#\$%\+£¢€¥\^°=¶∆×÷π√✓|©®:;\?&\.\\\-]+/),
    examples = "Input wsf or wbs\n*example:*\n" + usedPrefix + command + " 😎" + usedPrefix + "😎" + usedPrefix + ["wsf", "wbs"].getRandom();
  if (!a || !b) throw "Input emoji\n*example:*\n" + usedPrefix + command + " 😎" + usedPrefix + "😎" + "\n\n" + examples;
  try {
    if (!c) {
      m.react(wait);
      let anu = await (await fetch("https://api.andeer.top/API/emojimix.php?emoji1=" + encodeURIComponent(a) + "&emoji2=" + encodeURIComponent(b))).json();
      if (1 !== anu.code) return m.reply("*Can't mix these 2 emojis!*");
      let stiker = await sticker(!1, anu.data.url, packname, name);
      await conn.sendFile(m.chat, stiker, "sticker.webp", "", m);
    }
    if ("wsf" === c) {
      m.reply(wait + "\n[ WSF ]");
      let anu = await (await fetch("https://api.andeer.top/API/emojimix.php?emoji1=" + encodeURIComponent(a) + "&emoji2=" + encodeURIComponent(b))).json();
      if (1 !== anu.code) return m.reply("*Can't mix these 2 emojis!*");
      let stiker = await createSticker(!1, anu.data.url, packname, name, 60);
      m.reply(stiker);
    }
    if ("wbs" === c) {
      m.reply(wait + "\n[ WIBUSOFT ]");
      let anu = await (await fetch("https://api.andeer.top/API/emojimix.php?emoji1=" + encodeURIComponent(a) + "&emoji2=" + encodeURIComponent(b))).json();
      if (1 !== anu.code) return m.reply("*Can't mix these 2 emojis!*");
      let stiker = await wibusoft.tools.makeSticker(anu.data.url, {
        author: packname,
        pack: name
      });
      m.reply(stiker);
    }
  } catch (e) {
    return m.react(eror);
  }
};
handler.help = ["emojimix2"].map(v => v + " emot1|emot2>"), handler.tags = ["misc"],
  handler.command = /^em(ojim)?ix2$/i;
export default handler;
async function createSticker(img, url, packName, authorName, quality) {
  return new Sticker(img || url, {
    type: "full",
    pack: packName,
    author: authorName,
    quality: quality
  }).toBuffer();
}
