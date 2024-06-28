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
  text,
  command
}) => {
  if (!text) throw "input text";
  try {
    m.react(wait);
    let res = await FlatIcon(text),
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
handler.help = ["flaticon"], handler.tags = ["internet"], handler.command = /^flaticon$/i;
export default handler;
async function FlatIcon(query) {
  let res = await fetch("https://www.flaticon.com/free-icons/" + query),
    html = await res.text();
  var collection = new JSDOM(html).window.document.querySelectorAll(".icon--item");
  let img = [];
  for (var i = 0; i < collection.length; i++) img.push(collection[i].getAttribute("data-png"));
  return img.filter(el => null != el);
}