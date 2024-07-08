export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  try {
    let name = await this.getName(m.sender),
      chat = db.data.chats[m.chat],
      user = db.data.users[m.sender];
    !isAdmin && !isBotAdmin && chat.antibule && (!m.sender.startsWith("62") || !m.sender.endsWith("@s.whatsapp.net")) ? (user.banned = true, await this.reply(m.chat, `👋 Anti Bule ${name} @${m.sender.split("@")[0]}, Thanks!`.trim(), m, {
      mentions: this.parseMention(caption)
    })) : null;
  } catch (error) {
    console.error(error);
  }
}
