import similarity from "similarity";
const threshold = .72;
export async function before(m) {
  let id = m.chat;
  if (!m.quoted || !m.quoted?.fromMe || !m.quoted?.isBaileys || !m.text || !/Ketik.*hcak/i.test(m.quoted?.text) || /.*hcak/i.test(m.text)) return !0;
  if (this.caklontong = this.caklontong ? this.caklontong : {}, !(id in this.caklontong)) return await this.reply(m.chat, "Soal itu telah berakhir", m);
  if (m.quoted?.id === this.caklontong[id][0]?.id) {
    if (/^((me)?nyerah|surr?ender)$/i.test(m.text)) return clearTimeout(this.caklontong[id][3]),
      delete this.caklontong[id], await this.reply(m.chat, "*Yah Menyerah :( !*", m);
    let json = JSON.parse(JSON.stringify(this.caklontong[id][1]));
    m.text.toLowerCase() === json.jawaban.toLowerCase().trim() ? (db.data.users[m.sender].exp += this.caklontong[id][2], await this.reply(m.chat, `✅ *Benar!*\n+${this.caklontong[id][2]} XP`, m), clearTimeout(this.caklontong[id][3]), delete this.caklontong[id]) : similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= .72 ? m.reply("❗ *Dikit Lagi!*") : await this.reply(m.chat, "❌ *Salah!*", m);
  }
  return !0;
}
export const exp = 0;
const buttoncaklontong = [
  ["caklontong", "/caklontong"]
];