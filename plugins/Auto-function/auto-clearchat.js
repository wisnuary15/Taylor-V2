export async function before(m) {
  this.autoclear = this.autoclear ? this.autoclear : {};
  m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
  let id = m.chat;
  if (id in this.autoclear) return !1;
  const jadwalSholat = {
      Fajr: "04:49",
      Sunrise: "06:04",
      Dhuhr: "12:06",
      Asr: "15:21",
      Sunset: "18:08",
      Maghrib: "18:08",
      Isha: "19:38",
      Imsak: "04:39",
      Midnight: "00:06",
      Firstthird: "22:07",
      Lastthird: "02:06"
    },
    date = new Date(new Date().toLocaleString("en-US", {
      timeZone: "Asia/Makassar"
    })),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  for (const [sholat, waktu] of Object.entries(jadwalSholat)) timeNow === waktu && (this.autoclear[id] = [setTimeout(async () => {
    const chatIdsToDelete = Object.values(this.chats).filter(item => /@g\.us$/.test(item.jid)).map(item => item.jid),
      deletedGroupCount = chatIdsToDelete.length;
    for (const id of chatIdsToDelete) await this.chatModify({
      delete: !0,
      lastMessages: [{
        key: m.key,
        messageTimestamp: m.messageTimestamp
      }]
    }, id), console.log(`Grup dihapus: ${id}`);
    console.log(`Pembersihan berhasil. Jumlah grup yang dihapus: ${deletedGroupCount}`),
      delete this.autoclear[id];
  }, 57e3)]);
}
export const disabled = !1;