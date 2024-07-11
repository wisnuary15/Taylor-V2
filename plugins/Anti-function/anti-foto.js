export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  let chat = db.data.chats[m.chat],
    isFoto = (db.data.chats[m.sender], m.mtype),
    hapus = m.key.participant,
    bang = m.key.id;
  return !chat.antiFoto || !isFoto || "imageMessage" !== isFoto || (!(!isAdmin && isBotAdmin) || (m.reply("*Foto Terdeteksi*\n\nMaaf Tapi Harus Saya Hapus Karna Di Admin/Owner Mengaktifkan Anti Foto Untuk Chat Ini"), await this.sendMessage(m.chat, {
    delete: {
      remoteJid: m.chat,
      fromMe: !1,
      id: bang,
      participant: hapus
    }
  })));
}
