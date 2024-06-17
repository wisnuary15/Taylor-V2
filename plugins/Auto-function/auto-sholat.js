export async function before(m) {
  this.autosholat = this.autosholat ? this.autosholat : {};
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender,
    id = m.chat;
  if (id in this.autosholat) return !1;
  let jadwalSholat = {
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
  };
  const date = new Date((new Date).toLocaleString("en-US", {
      timeZone: "Asia/Makassar"
    })),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  for (const [sholat, waktu] of Object.entries(jadwalSholat))
    if (timeNow === waktu) {
      let caption = `Hai kak @${who.split("@")[0]},\nWaktu *${sholat}* telah tiba, ambilah air wudhu dan segeralah shalat🙂.\n\n*${waktu}*\n_untuk wilayah Makassar dan sekitarnya._`;
      this.autosholat[id] = [await this.reply(m.chat, caption, null, {
        contextInfo: {
          mentionedJid: [who],
          externalAdReply: {
            title: "Auto Sholat",
            thumbnail: await (await this.getFile("https://cdn-icons-png.flaticon.com/128/4527/4527060.png")).data
          }
        }
      }), setTimeout((() => {
        delete this.autosholat[id];
      }), 57e3)];
    }
}
export const disabled = !1;