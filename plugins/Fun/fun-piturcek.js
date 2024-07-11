import fetch from "node-fetch";
import fs from "fs";
const handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  let template = (args[0] || "").toLowerCase();
  if (!args[0]) {
    let caption = `*Contoh Penggunaan*\n\n${usedPrefix + command} tai @user\n\n*List Command*\n• anjing\n• asu\n• babi\n• bajingan\n• banci\n• bangsat\n• bego\n• bejad\n• bencong\n• bolot\n• brengsek\n• budek\n• buta\n• geblek\n• gembel\n• gila\n• goblok\n• iblis\n• idiot\n• jablay\n• jelek\n• kampret\n• kampungan\n• kamseupay\n• keparat\n• kontol\n• kunyuk\n• maho\n• memek\n• monyet\n• ngentot\n• pecun\n• perek\n• sarap\n• setan\n• sinting\n• sompret\n• tai\n• tolol\n• udik\n`;
    await conn.reply(m.chat, caption, m, {
      mentions: conn.parseMention(caption)
    });
  }
  if (command) switch (template) {
    case "anjing":
    case "asu":
    case "babi":
    case "bajingan":
    case "banci":
    case "bangsat":
    case "bego":
    case "bejad":
    case "bencong":
    case "bolot":
    case "brengsek":
    case "budek":
    case "buta":
    case "geblek":
    case "gembel":
    case "gila":
    case "goblok":
    case "iblis":
    case "idiot":
    case "jablay":
    case "jelek":
    case "kampret":
    case "kampungan":
    case "kamseupay":
    case "keparat":
    case "kontol":
    case "kunyuk":
    case "maho":
    case "memek":
    case "monyet":
    case "ngentot":
    case "pecun":
    case "perek":
    case "sarap":
    case "setan":
    case "sinting":
    case "sompret":
    case "tai":
    case "tolol":
    case "udik":
      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender,
        name = (await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom()), conn.getName(who)),
        sim = 100..getRandom(),
        caption = `Tingkat ke *${args[0]}an* \nAtas nama ${name ? args[1] : "*Semua Member*"} ${who.split("@")[0], 
        args[1]} \nAdalah Sebesar *${Number(sim).toFixed(2)}%*`;
      await conn.reply(m.chat, caption, m, {
        mentions: conn.parseMention(caption)
      });
  }
};
handler.help = ["cek <menu> <user>"], handler.tags = ["tools"], handler.command = /^cek$/i;
export default handler;
