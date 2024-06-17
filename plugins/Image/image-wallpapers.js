import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import { JSDOM } from "jsdom";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait);
    let res = await WallPapers(text),
      rdm = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, {
      image: {
        url: rdm
      }
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["wallpapers"], handler.tags = ["internet"], handler.command = /^wallpapers$/i;
export default handler;
async function WallPapers(query) {
  let res = await fetch("https://wallpapers.com/" + query),
    html = await res.text();
  var collection = new JSDOM(html).window.document.querySelectorAll(".promote");
  let img = [];
  for (var i = 0; i < collection.length; i++) img.push("https://wallpapers.com" + collection[i].getAttribute("src"));
  return img.filter((el => null != el));
}