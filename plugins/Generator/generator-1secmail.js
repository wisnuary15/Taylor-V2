import fetch from "node-fetch";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  text
}) => {
  conn.secmail = conn.secmail ? conn.secmail : {}
  let id = "secmail"
  let lister = ["create", "message", "delete"]
  let [feature, inputs, inputs_, inputs__, inputs___] = text.split(" ")
  if (!lister.includes(feature)) return m.reply("*Example:*\n" + usedPrefix + command +
    " create\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
  if (lister.includes(feature)) {
    if (feature === "create") {
      try {
        let eml = await random_mail()
        let info = eml[0]?.split('@')
        conn.secmail[id] = [
          m.reply("*EMAIL:*\n" + eml[0] + "\n\n" + "*Login:*\n" + info[0] + "\n\n*Domain:*\n" + info[1] +
            "\n\n_Ketik *" + usedPrefix + command + " message* Untuk mengecek inbox_"),
          eml[0],
          info[0],
          info[1]
        ]
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "message") {
      if (!conn.secmail[id]) return m.reply("Tidak ada pesan, buat email terlebih dahulu\nKetik *" + usedPrefix +
        command + " create*")
      try {
        let eml = await get_mails(conn.secmail[id][2], conn.secmail[id][3])
        let teks = eml.map((v, index) => {
          return `*EMAIL [ ${index + 1} ]*
*ID* : ${v.id}
*Dari* : ${v.from}

*Subjek* : ${v.subject}
*Date* : ${v.date}
   `.trim()
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks || "*KOSONG*" + "\n\n_Ketik *" + usedPrefix + command + " delete* Untuk menghapus email_")
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "delete") {
      if (!conn.secmail[id]) return m.reply("Tidak ada email yang terpakai")
      try {
        delete conn.secmail[id]
        m.reply("Sukses menghapus email")
      } catch (e) {
        m.react(eror)
      }
    }
  }
}
handler.help = ["secmail"]
handler.tags = ["misc"]
handler.command = /^(secmail)$/i
export default handler

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

function formatBytes(sizeInBytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let size = sizeInBytes,
    unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) size /= 1024, unitIndex++;
  return size.toFixed(2) + " " + units[unitIndex];
}
async function random_mail() {
  const link = "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1"
  try {
    let response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
async function get_mails(id, domain) {
  const link = `https://www.1secmail.com/api/v1/?action=getMessages&login=${id}&domain=${domain}`;
  try {
    let response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
