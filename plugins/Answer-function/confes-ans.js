const delay = time => new Promise(res => setTimeout(res, time));
let handler = m => m;
handler.all = async function(m) {
  if (!m.chat?.endsWith("@s.whatsapp.net")) return !0;
  this.confess = this.confess ? this.confess : {};
  let mf = Object.values(this.confess).find(v => !1 === v.status && v.penerima === m.sender);
  if (!mf) return !0;
  if (console.log({
      text: m.text
    }), mf && ("balas" === m.text || "Balas" === m.text || "" === m.text) && "extendedTextMessage" === m.quoted?.mtype) return m.reply("Silahkan kirim pesan balasan kamu.");
  let txt = `Hai kak @${mf.dari.split("@")[0]}, kamu menerima balasan nih.\n\nPesan yang kamu kirim sebelumnya:\n${mf.pesan}\n\nPesan balasannya:\n${m.text}\n`.trim();
  return await this.reply(mf.dari, txt, null).then(() => (m.reply("Berhasil mengirim balasan."), delay(2e3), delete this.confess[mf.id], !0)), !0;
};
export default handler;
