import similarity from "similarity";
const threshold = .72;
export async function before(m) {
  let id = m.chat;
  if (!m.quoted || !m.quoted?.fromMe || !m.quoted?.isBaileys || !m.text || !(/🕹️ GAME - TEBAKHEROML[\s\S]*Balas pesan ini untuk menjawab/i.test(m.text || "") || /🕹️ GAME - TEBAKHEROML[\s\S]*Balas pesan ini untuk menjawab/i.test(m.quoted?.text || ""))) return !0;
  if (this.tebakheroml = this.tebakheroml ? this.tebakheroml : {}, !(id in this.tebakheroml)) return await this.reply(m.chat, "Soal tebakheroml itu telah berakhir", m);
  if (m.quoted?.id === this.tebakheroml[id][0]?.id) {
    if (/^((me)?nyerah|surr?ender)$/i.test(m.text)) return clearTimeout(this.tebakheroml[id][3]),
      delete this.tebakheroml[id], await this.reply(m.chat, "❌ *Yah Menyerah :( !*", m, {
        contextInfo: {
          mentionedJid: [m.sender],
          externalAdReply: {
            title: "MENYERAH",
            renderLargerThumbnail: false,
            thumbnailUrl: "https://cdn-icons-png.flaticon.com/128/11378/11378648.png"
          }
        }
      });
    let json = JSON.parse(JSON.stringify(this.tebakheroml[id][1]));
    m.text.toLowerCase() === json.title.toLowerCase().trim() ? (db.data.users[m.sender].exp += this.tebakheroml[id][2], await this.reply(m.chat, `✅ *Benar!*\n+${this.tebakheroml[id][2]} XP`, m, {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "JAWABAN BENAR",
          renderLargerThumbnail: false,
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/128/8832/8832108.png"
        }
      }
    }), clearTimeout(this.tebakheroml[id][3]), delete this.tebakheroml[id]) : similarity(m.text.toLowerCase(), json.title.toLowerCase().trim()) >= .72 ? await this.reply(m.chat, "❗ *Sedikit Lagi!*", m, {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "JAWABAN HAMPIR BENAR",
          renderLargerThumbnail: false,
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/128/5683/5683325.png"
        }
      }
    }) : await this.reply(m.chat, "❌ *Salah!*", m, {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: "JAWABAN SALAH",
          renderLargerThumbnail: false,
          thumbnailUrl: "https://cdn-icons-png.flaticon.com/128/11378/11378648.png"
        }
      }
    });
  }
  return !0;
}
export const exp = 0;