import moment from "moment-timezone";
const handler = async (m, {
  conn,
  text,
  command
}) => {
  let who;
  who = m.isGroup ? m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted?.sender : m.sender : m.sender;
  try {
    let bio = await conn.fetchStatus(who),
      setAt = moment.utc(bio.setAt, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY-MM-DD");
    await conn.reply(m.chat, "*Status:* " + bio.status + "\n*Set At:* " + setAt, fakes, adReply);
  } catch {
    throw "Terjadi kesalahan";
  }
};
handler.help = ["getbio <@tag/reply>"], handler.tags = ["main"], handler.command = /^(getb?io)$/i;
export default handler;
