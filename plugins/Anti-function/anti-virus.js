export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = db.data.chats[m.chat],
    bot = db.data.settings[this.user.jid] || {},
    hapus = m.key.participant,
    bang = m.key.id,
    isVirtexOn = /(PLHIPS|৭৭|๑๑|๒๒|[Đৡดผ๖⃝-⃟⃢-⃤㜸])/i.exec(m.text);
  if (chat.antiVirtex && isVirtexOn && !m.fromMe) {
    if (await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: !1,
          id: bang,
          participant: hapus
        }
      }), await this.groupParticipantsUpdate(m.chat, [m.sender], "remove"), await this.reply(m.chat, "*Font Virtext detect!*" + (isBotAdmin ? "" : "\n\n_Bot bukan admin_"), m), isBotAdmin && bot.restrict) return m.reply("Kick!");
    if (!bot.restrict) return m.reply("Mungkin dia atmin!");
  }
  return !0;
}
