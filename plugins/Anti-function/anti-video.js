export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  let chat = db.data.chats[m.chat],
    isVideo = (db.data.chats[m.sender], m.mtype),
    hapus = m.key.participant,
    bang = m.key.id;
  return !chat.antiVideo || !isVideo || "videoMessage" !== isVideo || (!(!isAdmin && isBotAdmin) || (m.reply("*Video Terdeteksi*\n\nMaaf Tapi Harus Saya Hapus, Karna Admin/Owner Mengaktifkan Anti Video Untuk Chat Ini"), await this.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: !1,
      id: bang,
      participant: hapus
    }
  })));
}
