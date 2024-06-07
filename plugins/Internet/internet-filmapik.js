import {
  filmApikS,
  filmApikDl
} from '../../lib/scraper/scraper-toolv2.js';
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  let lister = ["search", "down"]
  let [feature, inputs] = text.split("|")
  if (!lister.includes(feature)) return m.reply("*Example:*\n" + usedPrefix + command +
    " search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"))
  if (lister.includes(feature)) {
    if (feature === "search") {
      if (!inputs) return m.reply("Input query link\nExample: " + usedPrefix + command + " search|vpn")
      m.react(wait)
      try {
        let res = await filmApikS(inputs)
        let teks = res.data.map((item, index) => {
          return `🔍 *[ RESULT ${index + 1} ]*

📢 *Title:* ${item.title}
🔗 *Url:* ${item.url}
🔖 *Rating:* ${item.rating}
🌐 *Synopsis:* ${item.synopsis}
`
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks)
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "down") {
      if (!inputs) return m.reply("Input query link\nExample: " + usedPrefix + command + " down|link")
      m.react(wait)
      try {
        const item = await filmApikDl(inputs)
        const result = item.Url;
        let replyMessage = '*RESULT*\n';
        for (const key in result) {
          replyMessage += `- *${key}*: ${result[key]}\n`;
        }
        m.reply(replyMessage);
      } catch (e) {
        m.react(eror)
      }
    }
  }
}
handler.help = ["filmapik"]
handler.tags = ["internet"]
handler.command = /^(filmapik)$/i
export default handler
