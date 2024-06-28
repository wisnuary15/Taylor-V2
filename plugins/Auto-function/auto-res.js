import fetch from "node-fetch";
import fs from "fs";
export async function all(m) {
  if (this && !m.isBaileys && !m.chat?.endsWith("broadcast") && m.isGroup && m.sender && m.mentionedJid.includes(this.user.jid)) try {
    let pp = await this.profilePictureUrl(m.sender, "image").catch(_ => "https://telegra.ph/file/24fa902ead26340f3df2c.png"),
      stc = await fs.promises.readFile(`./sticker/ress${pickRandom(1, 9)}.webp`);
    await this.sendMessage(m.chat, {
      sticker: stc,
      thumbnail: await (await fetch(pp)).arrayBuffer(),
      contextInfo: {
        externalAdReply: {
          showAdAttribution: !0,
          mediaType: 1,
          mediaUrl: sig,
          title: "「 ❔ 」",
          body: wm,
          sourceUrl: "http://github.com/AyGemuy",
          thumbnail: await (await fetch(pp)).arrayBuffer()
        }
      }
    }, {
      quoted: m
    });
  } catch (e) {
    console.error(e);
  }
}

function pickRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}