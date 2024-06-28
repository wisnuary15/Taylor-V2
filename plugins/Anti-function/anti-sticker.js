export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys || "stickerMessage" !== m.mtype || !db.data.chats[m.chat].antiSticker) return;
  const user = db.data.users[m.sender];
  if (user.warn += 1, user.banned = !0, m.reply("⚠️ *Stiker Terdeteksi!* ⚠️\nKamu telah mengirimkan stiker yang tidak diizinkan."), isAdmin || isBotAdmin) {
    const deleteMessage = {
      delete: {
        remoteJid: m.key.remoteJid,
        fromMe: !1,
        id: m.key.id,
        participant: [m.sender]
      }
    };
    m.reply(isAdmin ? "❌ *Kamu tidak diizinkan mengirim stiker.*" : "❌ *Stiker terdeteksi dan dihapus.*"),
      await this.sendMessage(m.chat, deleteMessage);
  }
}