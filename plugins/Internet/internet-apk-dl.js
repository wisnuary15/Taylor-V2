import cheerio from 'cheerio';
import fetch from 'node-fetch';
import {
  apkdl,
  apkcombo,
  aptoide
} from '../../lib/scraper/scraper-apk.js';
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  let lister = ["search", "app"]
  let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")
  if (!lister.includes(feature)) return m.reply("*Example:*\n.apkdl search|vpn\n\n*Pilih type yg ada*\n" + lister
    .map((v, index) => "  ○ " + v).join("\n"))
  if (lister.includes(feature)) {
    if (feature === "search") {
      if (!inputs) return m.reply("Input query link\nExample: .apkdl search|vpn")
      m.react(wait)
      try {
        let res = await apkdl.search(inputs)
        let teks = res.map((item, index) => {
          return `🔍 *[ RESULT ${index + 1} ]*
📰 *Title:* ${item.name}
🔗 *Url:* ${item.link}`
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks)
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "app") {
      if (!inputs) return m.reply("Input query link\nExample: .apkdl app|link")
      try {
        let resl = await apkdl.download(inputs)
        let cap = "*Name:* " + resl.appname + "\n" + "*Link:* " + resl.link + "\n\n" + wait
        conn.sendFile(m.chat, resl.img, "", cap, m)
        conn.sendFile(m.chat, resl.link, resl.appname, null, m, true, {
          quoted: m,
          mimetype: "application/vnd.android.package-archive"
        })
      } catch (e) {
        m.react(eror)
      }
    }
  }
}
handler.help = ["apkdl"]
handler.tags = ["internet"]
handler.command = /^(apkdl)$/i
export default handler
/* New Line */
