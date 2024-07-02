import fetch from "node-fetch";
export async function before(m) {
  let id = m.chat,
    imgr = flaaa.getRandom();
  if (this.skata = this.skata ? this.skata : {}, /nyerah/i.test(m.text) && id in this.skata) return delete this.skata[id],
    await this.reply(m.chat, "Mulai lagi?", m);
  if (!(m.quoted && m.quoted?.fromMe && m.quoted?.isBaileys && /(Mulai|Lanjut) :/i.test(m.quoted?.text))) return !0;
  if (!(id in this.skata)) return await this.reply(m.chat, "Mulai lagi?", m);
  if (m.quoted?.id === this.skata[id][0]?.id) {
    let answerF = m.text.toLowerCase().split(" ")[0].trim(),
      res = await fetch("https://api.lolhuman.xyz/api/sambungkata?apikey=" + lolkey + "&text=" + m.text.toLowerCase()),
      json = await res.json();
    return answerF.startsWith(this.skata[id][1].slice(-1)) ? json.status ? this.skata[id][1] === answerF ? await this.reply(m.chat, "👎🏻 *Salah!*\nJawabanmu sama dengan soal, silahkan cari kata lain!", m) : this.skata[id][2].includes(answerF) ? await this.reply(m.chat, `👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* sudah pernah digunakan!`, m) : (db.data.users[m.sender].exp += 100, this.skata[id][2].push(answerF), this.skata[id] = [await this.sendFile(m.chat, imgr + "Lanjut", "", "*Lanjut mulai dari kata: * " + answerF.toUpperCase() + "\n\n*Awalan:* " + answerF.slice(-1).toUpperCase() + "... ?\n\n*balas pesan ini untuk menjawab!*", m), answerF, this.skata[id][2]], !0) : await this.reply(m.chat, `👎🏻 *Salah!*\nKata *${m.text.toUpperCase()}* tidak valid!`, m) : await this.reply(m.chat, `👎🏻 *Salah!*\nJawaban harus dimulai dari kata *${this.skata[id][1].slice(-1).toUpperCase()}*`, m);
  }
}
