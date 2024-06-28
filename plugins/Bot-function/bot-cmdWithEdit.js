const {
  proto,
  generateWAMessage,
  areJidsSameUser
} = (await import("@whiskeysockets/baileys")).default;
export async function all(m, chatUpdate) {
  try {
    if (m.isBaileys || !m.message || !m.message.editedMessage) return;
    const editedMsg = m.message.editedMessage;
    if (editedMsg.imageMessage || editedMsg.videoMessage || editedMsg.documentMessage || editedMsg.editedMessage && (editedMsg.editedMessage.imageMessage || editedMsg.editedMessage.videoMessage || editedMsg.editedMessage.documentMessage)) {
      return;
    }
    let hash = {
      text: editedMsg.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || editedMsg.extendedTextMessage?.text || null,
      mentionedJid: m.sender || null
    };
    let {
      text: inputText,
      mentionedJid: userMention
    } = hash;
    if (!(inputText && userMention)) return;
    let messages = await generateWAMessage(m.chat, {
      text: inputText,
      mentions: [userMention]
    }, {
      userJid: this.user.jid || this.user.id,
      quoted: m.quoted && m.quoted?.fakeObj
    });
    messages.key.fromMe = areJidsSameUser(m.sender, this.user.jid || this.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName || m.name;
    if (m.isGroup) messages.participant = m.sender || m.key.remoteJid || m.chat;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append"
    };
    this.ev.emit("messages.upsert", msg);
  } catch (error) {
    console.error("Error in processing message:", error);
  }
}