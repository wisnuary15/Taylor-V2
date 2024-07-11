import {
  readFileSync
} from "fs";
const kbbi = JSON.parse(readFileSync("./json/game/kata.json")) || ["cars", "cat"];
export async function before(m) {
  try {
    let id = m.chat,
      imgr = flaaa.getRandom();
    this.skata = this.skata || {};
    if (/nyerah/i.test(m.text) && id in this.skata) {
      delete this.skata[id];
      return await this.reply(m.chat, "Mulai lagi?", m);
    }
    if (!(m.quoted && m.quoted?.fromMe && m.quoted?.isBaileys && /(Mulai|Lanjut) :/i.test(m.quoted?.text))) return true;
    if (!(id in this.skata)) return await this.reply(m.chat, "Mulai lagi?", m);
    if (m.quoted?.id !== this.skata[id][0]?.id) return true;
    let answerF = m.text.toLowerCase().split(" ")[0].trim();
    let isValidKata = kbbi.includes(answerF);
    if (!answerF.startsWith(this.skata[id][1].slice(-1))) {
      return await this.reply(m.chat, `👎🏻 *Salah!*\nJawaban harus dimulai dari kata *${this.skata[id][1].slice(-1).toUpperCase()}*`, m);
    }
    if (!isValidKata) {
      return await this.reply(m.chat, `👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* tidak valid!`, m);
    }
    if (this.skata[id][1] === answerF) {
      return await this.reply(m.chat, "👎🏻 *Salah!*\nJawabanmu sama dengan soal, silahkan cari kata lain!", m);
    }
    if (this.skata[id][2].includes(answerF)) {
      return await this.reply(m.chat, `👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* sudah pernah digunakan!`, m);
    }
    db.data.users[m.sender].exp += 100;
    this.skata[id][2].push(answerF);
    this.skata[id] = [await this.sendFile(m.chat, `${imgr}Lanjut`, "", `*Lanjut mulai dari kata:* ${answerF.toUpperCase()}\n\n*Awalan:* ${answerF.slice(-1).toUpperCase()}... ?\n\n*balas pesan ini untuk menjawab!*`, m), answerF, this.skata[id][2]];
    return true;
  } catch (err) {
    console.error(err);
    return await this.reply(m.chat, "Terjadi kesalahan, coba lagi nanti.", m);
  }
}
