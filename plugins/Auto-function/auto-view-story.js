export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if ("status@broadcast" != m.key.remoteJid) return !1;
  let database = db.data.database;
  const story = database.story || [];
  const {
    mtype,
    text,
    sender
  } = m, chat = (m.sender.split("@")[0], db.data.chats[m.chat]);
  if ("imageMessage" === mtype || "videoMessage" === mtype) {
    const caption = text || "";
    try {
      let buffer = await m.download();
      await this.sendFile(sender, buffer, "", caption, m, !1, {
        mentions: [m.sender]
      }), story.push({
        type: mtype,
        quoted: m,
        sender: m.sender,
        caption: caption,
        buffer: buffer
      });
    } catch (e) {
      console.log(e), await this.reply(sender, caption, m, {
        mentions: [m.sender]
      });
    }
  } else if ("audioMessage" === mtype) try {
    let buffer = await m.download();
    await this.sendFile(sender, buffer, "", "", m, !1, {
      mimetype: m.mimetype
    }), story.push({
      type: mtype,
      quoted: m,
      sender: m.sender,
      buffer: buffer
    });
  } catch (e) {
    console.log(e);
  } else if ("extendedTextMessage" === mtype) {
    const pesan = text || "";
    await this.reply(sender, pesan, m, {
      mentions: [m.sender]
    }), story.push({
      type: mtype,
      quoted: m,
      sender: m.sender,
      message: pesan
    });
  }
  return !!chat.viewStory || void 0;
}
