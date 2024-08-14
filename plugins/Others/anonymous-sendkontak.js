const handler = async (m, {
  command,
  conn,
  text
}) => {
  conn.anonymous = conn.anonymous || {};
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let room = Object.values(conn.anonymous).find(room => room.check(who));
  if (!room) {
    await conn.reply(m.chat, "🚫 *Kamu tidak berada di sesi anonymous chat.*\n\nGunakan *!anonymous start* untuk memulai sesi baru.", m);
    return;
  }
  let other = room.other(who);
  let name = text || m.name;
  let contactInfo = `➔ Nomor: ${m.sender.split("@")[0]}\n➔ Nama: ${name}`;
  await conn.reply(m.chat, "📤 *Mengirimkan kontak...*", m);
  if (other) {
    await conn.reply(other, "👤 *Partner mengirimkan kontak kepadamu.*", m);
    let profilePicUrl;
    try {
      profilePicUrl = await conn.profilePictureUrl(m.sender, "image");
    } catch {
      profilePicUrl = "./thumbnail.jpg";
    }
    await conn.sendFile(other, profilePicUrl, "", `📋 *Anonymous Chats*\n\n${contactInfo}`, m, {
      mentions: [m.sender]
    });
  }
};
handler.help = ["sendkontak"];
handler.tags = "anonymous";
handler.command = /^(sendkontak)$/i;
handler.private = true;
export default handler;