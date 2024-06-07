export async function before(m) {
  try {
    let id = m.chat;
    let timeout = 180000;
    let reward = randomInt(100, 80000);
    let users = db.data.users[m.sender];
    let body = typeof m.text === 'string' && !isNaN(m.text) ? parseInt(m.text) : false;
    this.bomb = this.bomb ? this.bomb : {};
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text);
    if (isSurrender && this.bomb && (id in this.bomb)) {
      this.reply(m.chat, `🚩 Menyerah`, m);
      clearTimeout(this.bomb[id][2]);
      delete this.bomb[id];
    }
    if (this.bomb[id] && m.quoted && m.quoted?.id === this.bomb[id][3].id && !isNaN(body)) {
      let json = this.bomb[id][1].find(v => v.position === body);
      let player = this.bomb[id][1].find(v => v.player === m.sender);
      if (!player) return this.reply(m.chat, `🚩 Bukan sesi permainanmu.`, m);
      if (!json) return this.reply(m.chat, `🚩 Untuk membuka kotak kirim angka 1 - 9`, this.bomb[id][0]);
      if (body === false || body < 1 || body > 9) {
        return this.reply(m.chat, `🚩 Masukkan angka antara 1 - 9.`, m);
      }
      if (json.emot === '💥') {
        json.state = true;
        let bomb = this.bomb[id][1];
        let teks = `乂  *B O M B*\n\n`;
        teks += bomb.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
        teks += bomb.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
        teks += bomb.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
        teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`;
        teks += `*Permainan selesai!*, kotak berisi bom terbuka : (- *${formatNumber(reward)}*)`;
        this.reply(m.chat, teks, this.bomb[id][0]).then(() => {
          users.exp < reward ? users.exp = 0 : users.exp -= reward;
          clearTimeout(this.bomb[id][2]);
          delete this.bomb[id];
        });
      } else if (json.state) {
        return this.reply(m.chat, `🚩 Kotak ${json.number} sudah di buka silahkan pilih kotak yang lain.`, this.bomb[
          id][0]);
      } else {
        json.state = true;
        let changes = this.bomb[id][1];
        let open = changes.filter(v => v.state && v.emot != '💥').length;
        if (open >= 8) {
          let teks = `乂  *B O M B*\n\n`;
          teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
          teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
          teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
          teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
          teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`;
          teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${formatNumber(reward)}*)`;
          this.reply(m.chat, teks, this.bomb[id][0]).then(() => {
            users.exp += reward;
            clearTimeout(this.bomb[id][2]);
            delete this.bomb[id];
          });
        } else {
          let teks = `乂  *B O M B*\n\n`;
          teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`;
          teks += changes.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n';
          teks += changes.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n';
          teks += changes.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n';
          teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`;
          teks += `Kotak berisi bom tidak terbuka : (+ *${formatNumber(reward)}*)`;
          this.sendMessage(m.chat, {
            text: teks,
            edit: this.bomb[id][3]
          }).then(() => {
            users.exp += reward;
          });
        }
      }
    }
  } catch (e) {
    return this.reply(m.chat, e, m);
  }
  return !0;
}
export const exp = 0;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatNumber(number) {
  return number.toLocaleString();
}
