import {
  randomBytes
} from "crypto";
const handler = async (m, {
  conn,
  text,
  args,
  usedPrefix,
  command
}) => {
  conn.getName(m.sender);
  let imgr = flaaa.getRandom(),
    chats = Object.entries(conn.chats).filter(([_, chat]) => chat.isChats).map(v => v[0]),
    cc = conn.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : m);
  text || cc.text;
  await conn.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m);
  for (let id of chats)
    if (await delay(1500), "polling" === args[0]) {
      let a = text.split("|").slice(1);
      if (!a[1]) throw "Format\n" + usedPrefix + command + " halo |ya|gak";
      if (a[12]) throw "Kebanyakan pilihan, Format\n" + usedPrefix + command + " halo |ya|gak";
      if (checkDuplicate(a)) throw "Ada kesamaan isi dalam pesan!";
      const pollMessage = {
        name: "*Polling Request By* " + m.name + "\n*Pesan:* " + text.split("|")[0],
        values: a,
        multiselect: !1,
        selectableCount: 1
      };
      await conn.sendMessage(id, {
        poll: pollMessage
      });
    } else if ("sharebot" === args[0]) {
    let contactArray = imgr.endsWith("@g.us") ? [
      [conn.user.jid.split("@")[0], conn.getName(conn.user.jid), "🔥 Bot WhatsApp 🐣", "📵 Dont spam/call me 😢", "Nothing", "🇮🇩 Indonesia", "🚀 https://s.id/Cerdasin62/", "🤖 Hanya bot biasa yang kadang suka eror ☺"]
    ] : {
      protocolMessage: {
        type: 11
      }
    };
    await conn.sendContactArray(id, contactArray, m);
  } else await conn.sendFile(id, imgr + "BROADCAST", "", htki + " *BROADCAST* " + htka + "\n\n*Pesan:*\n" + text, m);
  m.reply("Selesai Broadcast All Chat :)");
};
handler.help = ["broadcast", "bc"].map(v => v + " <teks>"), handler.tags = ["owner"],
  handler.command = /^(broadcast|bc)$/i, handler.owner = !0;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001),
  delay = time => new Promise(res => setTimeout(res, time)),
  randomID = length => randomBytes(Math.ceil(.5 * length)).toString("hex").slice(0, length);

function checkDuplicate(arr) {
  return new Set(arr).size !== arr.length;
}