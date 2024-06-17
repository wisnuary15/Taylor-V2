export async function before(m, { isAdmin: isAdmin, isBotAdmin: isBotAdmin }) {
  let name = await this.getName(m.sender),
    chat = db.data.chats[m.chat],
    user = db.data.users[m.sender],
    caption = `👋 Anti Bule ${name} @${m.sender.split("@")[0]}, Thanks!`.trim();
  if (chat.antibule && !m.sender.startsWith("62")) return user.banned = !0, await this.reply(m.chat, caption, m, {
    mentions: this.parseMention(caption)
  }), this.groupParticipantsUpdate(m.chat, [m.sender], "remove");
}