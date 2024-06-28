const isLinkTik = /tiktok.com/i,
  isLinkYt = /youtube.com|youtu.be/i,
  isLinkTel = /t.me/i,
  isLinkFb = /facebook.com|fb.me/i,
  isLinkIg = /instagram.com/i,
  isLinkWa = /chat.whatsapp.com/i,
  isLinkHttp = /http|https/i;
export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = db.data.chats[m.chat],
    user = db.data.users[m.sender];
  db.data.settings[this.user.jid];
  const isAntiLinkTik = isLinkTik.exec(m.text),
    isAntiLinkYt = isLinkYt.exec(m.text),
    isAntiLinkTel = isLinkTel.exec(m.text),
    isAntiLinkFb = isLinkFb.exec(m.text),
    isAntiLinkIg = isLinkIg.exec(m.text),
    isAntiLinkWa = isLinkWa.exec(m.text),
    isAntiLinkHttp = isLinkHttp.exec(m.text);
  let hapus = m.key.participant,
    bang = m.key.id;
  if (chat.antiLinkTik && isAntiLinkTik) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkYt && isAntiLinkYt) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkTel && isAntiLinkTel) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkFb && isAntiLinkFb) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkIg && isAntiLinkIg) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkWa && isAntiLinkWa) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  if (chat.antiLinkHttp && isAntiLinkHttp) {
    if (await this.reply(m.chat, "*[ Link Detected ]*", m), !isBotAdmin) return m.reply("Bot bukan *Admin*");
    if (isAdmin) return m.reply("Kemungkinan anda adalah *Admin* !");
    if (isBotAdmin) return user.warn += 1, user.banned = !0, await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: !1,
        id: bang,
        participant: hapus
      }
    });
  }
  return !0;
}