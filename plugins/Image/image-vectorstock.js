import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import {
  JSDOM
} from "jsdom";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait);
    let res = await VectorDtock(text),
      rdm = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, {
      image: {
        url: rdm
      },
      caption: "[ RESULT ]"
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["vectorstock"], handler.tags = ["internet"], handler.command = /^vectorstock$/i;
export default handler;
async function VectorDtock(query) {
  let res = await fetch("https://www.vectorstock.com/royalty-free-vectors/" + query + "-vectors"),
    html = await res.text();
  var collection = new JSDOM(html).window.document.getElementsByTagName("img");
  let img = [];
  for (var i = 0; i < collection.length; i++) collection[i].getAttribute("src").startsWith("https://cdn.vectorstock.com") && img.push(collection[i].getAttribute("src"));
  return img.filter(el => null != el);
}
