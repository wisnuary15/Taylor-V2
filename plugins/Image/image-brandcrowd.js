import axios from "axios"
import fetch from "node-fetch"
import cheerio from "cheerio"
import {
  JSDOM
} from "jsdom"
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  try {
    m.react(wait)
    let res = await BrandCrowd(text)
    let rdm = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, {
      image: {
        url: rdm
      },
      caption: "[ RESULT ]"
    }, {
      quoted: m
    })
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["brandcrowd"]
handler.tags = ["internet"]
handler.command = /^brandcrowd$/i
export default handler
/* New Line */
async function BrandCrowd(query) {
  let res = await fetch('https://www.brandcrowd.com/maker/logos/page1?Text=' + query +
    '&TextChanged=true&SearchText&KeywordChanged=true&LogoStyle=0&FontStyles&Colors&FilterByTags')
  let html = await res.text()
  let dom = new JSDOM(html)
  var collection = dom.window.document.getElementsByTagName('img');
  let img = []
  for (var i = 0; i < collection.length; i++) {
    if (collection[i].getAttribute('src').startsWith('https://dynamic.brandcrowd.com')) {
      img.push(collection[i].getAttribute('src'))
    }
  }
  let newArr = img.filter(el => el != null);
  return newArr
}
