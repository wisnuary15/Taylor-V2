const isSatir = /(([Kk]enao|[Bb]ims|[Aa]v)a|tumlul|Tumlul|[Gg]wejh|[Oo]kgey|[Ss]iava|[Kk]avan|tenan|[Aa](msu|f[ah])|[Mm]gak|lmao|[Pp]edo|([Bb]an|hoo)h|[Kk]nf)/i;
export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = db.data.chats[m.chat],
    bot = db.data.settings[this.user.jid] || {};
  const isAntiSatir = isSatir.exec(m.text);
  let hapus = m.key.participant,
    bang = m.key.id;
  if (chat.antiSatir && isAntiSatir) {
    if (await this.reply(m.chat, "*Kata Satir Terdeteksi!* " + (isBotAdmin ? "" : "\n\n_Bot bukan atmin_"), m), isBotAdmin && bot.restrict) return db.data.users[m.sender].warn += 1, db.data.users[m.sender].banned = !0,
      await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: !1,
          id: bang,
          participant: hapus
        }
      });
    if (!bot.restrict) return m.reply("Semoga harimu suram!");
  }
  return !0;
}