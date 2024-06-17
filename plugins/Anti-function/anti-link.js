const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i;
export async function before(m, { isAdmin: isAdmin, isBotAdmin: isBotAdmin }) {
  if (m.isBaileys || !m.isGroup) return !1;
  const chat = db.data.chats[m.chat],
    isGroupLink = linkRegex.exec(m.text),
    kickMessage = isAdmin ? "❌ *Tautan Terdeteksi*\nAnda admin grup tidak bisa dikeluarkan dari grup." : "❌ *Tautan Terdeteksi*\nAnda akan dikeluarkan dari grup.";
  return chat.antiLink && isGroupLink && (await this.reply(m.chat, kickMessage, null, {
    mentions: [m.sender]
  }), await this.sendMessage(m.chat, {
    delete: m.key
  }), (!isBotAdmin && isAdmin || isBotAdmin && !isAdmin) && (await this.groupParticipantsUpdate(m.chat, [m.sender], "remove"),
    await this.reply(m.chat, kickMessage, null, {
      mentions: [m.sender]
    }), await this.sendMessage(m.chat, {
      delete: m.key
    }))), !0;
}