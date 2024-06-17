import fetch from "node-fetch";
import cheerio from "cheerio";
const handler = async (m, { command: command, usedPrefix: usedPrefix, conn: conn, text: text, args: args }) => {
  let lister = ["gc", "pc"],
    [feature, inputs, inputs_, inputs__, inputs___] = text.split("|");
  if (!lister.includes(feature)) throw "*Example:*\n.caripesan pc|halo\n\n*Pilih type yg ada*\n" + lister.map(((v, index) => "  ○ " + v)).join("\n");
  if (lister.includes(feature)) {
    if ("gc" === feature) {
      if (!inputs) throw "Input pesan yang mau di cari";
      let msge = Object.entries(await conn.chats).filter((([nama]) => !nama.endsWith("s.whatsapp.net"))).map((([nama, isi]) => ({
        nama: nama,
        messages: Object.values(isi.messages || {})
      }))).flatMap((({ messages: messages }) => Object.values(messages))).filter((obj => obj.message.extendedTextMessage && obj.message.extendedTextMessage.text.includes(inputs) || obj.message.conversation && obj.message.conversation.includes(inputs)));
      if (!msge) throw "Not found";
      {
        let caption = (await Promise.all(msge.map((async (v, index) => `*[ ${index + 1} ]*\n*Grup:*\n${conn.getName(v.key.remoteJid)}\n*Dari:*\n${"@" + v.key.participant.split("@")[0]}\n*Pesan:*\n${v.message.extendedTextMessage ? v.message.extendedTextMessage.text : v.message.conversation}`.trim())))).filter((v => v)).join("\n\n________________________\n\n");
        m.reply(caption, m.chat, {
          mentions: conn.parseMention(caption)
        });
      }
    }
    if ("pc" === feature) {
      if (!inputs) throw "Input pesan yang mau di cari";
      let msge = Object.entries(await conn.chats).filter((([nama]) => !nama.endsWith("g.us"))).map((([nama, isi]) => ({
        nama: nama,
        messages: Object.values(isi.messages || {})
      }))).flatMap((({ messages: messages }) => Object.values(messages))).filter((obj => obj.message.extendedTextMessage && obj.message.extendedTextMessage.text.includes(inputs) || obj.message.conversation && obj.message.conversation.includes(inputs)));
      if (!msge) throw "Not found";
      {
        let caption = (await Promise.all(msge.map((async (v, index) => `*[ ${index + 1} ]*\n*Dari:*\n${"@" + v.key.remoteJid.split("@")[0]}\n*Pesan:*\n${v.message.extendedTextMessage ? v.message.extendedTextMessage.text : v.message.conversation}`.trim())))).filter((v => v)).join("\n\n________________________\n\n");
        m.reply(caption, m.chat, {
          mentions: conn.parseMention(caption)
        });
      }
    }
  }
};
handler.help = ["caripesan type query"], handler.tags = ["search"], handler.command = /^(caripesan|searchmessage)$/i;
export default handler;