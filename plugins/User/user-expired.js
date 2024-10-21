export async function all(m) {
  if (!(m.isGroup && m.sender && !m.isBaileys)) return;
  const {
    chats
  } = db.data;
  const chatData = chats[m.chat];
  try {
    if (chatData.expired && !chatData.isBanned && Date.now() >= chatData.expired) {
      const caption = `
╭─❒ 「 *Left Grup* 」
│  Bye🖐 ${this.user.name} akan keluar dari grup ini!
│  
│  Terima kasih telah menggunakan layanan kami.
│  Sampai jumpa lagi!
╰───────❒`;
      await this.reply(m.chat, caption, m, {
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "GROUP EXPIRED",
            body: "",
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: false,
            thumbnailUrl: "https://cdn-icons-png.flaticon.com/128/5632/5632472.png",
            sourceUrl: ""
          }
        }
      });
      await this.groupLeave(m.chat);
      chatData.expired = 0;
      chatData.isBanned = true;
    }
  } catch (error) {
    console.error(`Gagal keluar dari grup ${m.chat}:`, error);
  }
}