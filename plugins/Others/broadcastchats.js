import { randomBytes } from "crypto";
const handler = async (m, { conn: conn, text: text }) => {
  let chats = Object.entries(conn.chats).filter((([jid, chat]) => !jid.endsWith("@g.us") && chat.isChats)).map((v => v[0])),
    cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : m),
    teks = text || cc.text;
  await conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m);
  for (let id of chats) await conn.copyNForward(id, conn.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : teks + "\n" + readMore + "「 " + author + " Broadcast 」\n" + randomID(8)), !0).catch((_ => _));
  m.reply("Selesai Broadcast All Chat :)");
};
handler.help = ["broadcastchats", "bcchats"].map((v => v + " <teks>")), handler.tags = ["owner"],
  handler.command = /^(broadcastchats?|bcc(hats?)?)$/i, handler.owner = !0;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001),
  randomID = length => randomBytes(Math.ceil(.5 * length)).toString("hex").slice(0, length);