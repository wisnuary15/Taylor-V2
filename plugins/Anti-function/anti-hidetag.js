export async function before(m, {
  isBotAdmin
}) {
  let chat = db.data.chats[m.chat];
  if (chat && m.isGroup && chat.antiHidetag && (m.message?.[m.mtype]?.contextInfo?.mentionedJid?.length || 0 || (m.msg?.contextInfo?.mentionedJid?.length || 0)) === (await this.groupMetadata(m.chat)).participants?.length) {
    console.log("[ANTI-HIDETAG]", `@${m.sender.split("@")[0]} mengirim pesan hidetag`);
    m.reply(`@${m.sender.split("@")[0]} Terdeteksi mengirim pesan hidetag!!`);
    if (isBotAdmin) {
      return await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant
        }
      });
    }
  }
}
