export async function before(m, {
isBotAdmin
}) {
let chat = db.data.chats[m.chat];
  if (
      m.isGroup &&
      chat.antiHidetag &&
      (m.message[m.mtype]?.contextInfo?.mentionedJid?.length || m.msg?.contextInfo?.mentionedJid?.length) ===
        (await this.groupMetadata(m.chat)).participants?.length
    ) {
      console.log(
        ("[ANTI-HIDETAG]", "red"),
        (`@${m.sender.split("@")[0]} mengirim pesan hidetag`, "white")
      );
      m.reply(`@${m.sender.split("@")[0]} Terdeteksi mengirim pesan hidetag!!`);
      if (isBotAdmin) return await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: m.key.id,
        participant: m.key.participant
      }
    });
    }
}