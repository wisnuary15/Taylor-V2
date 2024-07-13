import _ from "lodash";
const badWords = ["ajg", "anjink", "anjg", "anjk", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "goblog", "goblok", "guoblog", "guoblok", "henceut", "idiot", "jancok", "jembut", "jingan", "kafir", "kanjut", "keparat", "kntl", "kontol", "lonte", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "pantek", "peler", "pepek", "pler", "pucek", "puki", "pukimak", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "asu", "memeq"];
export async function before(m, {
  isAdmin,
  isBotAdmin,
  isOwner
}) {
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return false;
  const chat = db.data.chats[m.chat];
  if (!chat.antiToxic) return true;
  let database = db.data.database;
  database.badWords[m.chat] = database.badWords[m.chat] || [...badWords];
  const input = m.text || m.description;
  if (input?.trim().split(/\s+/)?.[0]?.toLowerCase() === "addbadword" && input?.trim().split(/\s+/)?.slice(1).join(" ")) {
    const newBadWord = input?.trim().split(/\s+/)?.slice(1).join(" ");
    database.badWords[m.chat].push(newBadWord);
    await this.reply(m.chat, `📝 *Badword "${newBadWord}" telah ditambahkan.*`, m);
    return true;
  }
  if (input?.trim().split(/\s+/)?.[0]?.toLowerCase() === "delbadword" && input?.trim().split(/\s+/)?.slice(1).join(" ")) {
    const wordToDelete = input?.trim().split(/\s+/)?.slice(1).join(" ");
    const index = _.indexOf(database.badWords[m.chat], wordToDelete);
    if (index > -1) {
      _.pullAt(database.badWords[m.chat], index);
      await this.reply(m.chat, `📝 *Badword "${wordToDelete}" telah dihapus.*`, m);
    } else {
      await this.reply(m.chat, `⚠️ *Badword "${wordToDelete}" tidak ditemukan.*`, m);
    }
    return true;
  }
  if (input?.trim().split(/\s+/)?.[0]?.toLowerCase() === "listbadword") {
    if (database.badWords[m.chat].length > 0) {
      const list = _.map(database.badWords[m.chat], (word, i) => `${i + 1}. ${word}`).join("\n");
      await this.reply(m.chat, `📜 *Daftar Badword:*\n${list}`, m);
    } else {
      await this.reply(m.chat, `⚠️ *Tidak ada badword yang terdaftar.*`, m);
    }
    return true;
  }
  const detectedWords = _.filter(database.badWords[m.chat], word => _.includes(input, word));
  if (chat.antiToxic && detectedWords.length > 0) {
    let warningMessage = `🚨 *Kata Toxic Terdeteksi!*\nKata yang terdeteksi: ${detectedWords.join(", ")}\n`;
    if (!isBotAdmin) {
      warningMessage += `\n_Bot bukan admin, tidak dapat menghapus pesan._\n`;
      await this.reply(m.chat, warningMessage, m);
      return true;
    }
    db.data.users[m.sender].warn += 1;
    if (!isOwner) db.data.users[m.sender].banned = true;
    await this.sendMessage(m.chat, {
      delete: m.key
    });
    warningMessage += `\nPeringatan: ${db.data.users[m.sender].warn}\nStatus: ${db.data.users[m.sender].banned ? "Diblokir" : "Aktif"}`;
    await this.reply(m.chat, warningMessage, m);
  }
  return true;
}
