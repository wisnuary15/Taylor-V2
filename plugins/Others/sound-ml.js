import axios from "axios";
import fetch from "node-fetch";
import cheerio from "cheerio";
import { JSDOM } from "jsdom";
const handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, text: text, command: command }) => {
  if (!text) throw "input text";
  try {
    if ("mlsounden" === command) {
      m.react(wait);
      let res = await MLSound("en", text),
        rdm = res[Math.floor(Math.random() * res.length)];
      await conn.sendMessage(m.chat, {
        audio: {
          url: rdm
        },
        seconds: fsizedoc,
        ptt: !0,
        mimetype: "audio/mpeg",
        fileName: rdm.split("/")[4] + ".mp3",
        waveform: [100, 0, 100, 0, 100, 0, 100]
      }, {
        quoted: m
      });
    }
    if ("mlsoundid" === command) {
      m.react(wait);
      let res = await MLSound("id", text),
        rdm = res[Math.floor(Math.random() * res.length)];
      await conn.sendMessage(m.chat, {
        audio: {
          url: rdm
        },
        seconds: fsizedoc,
        ptt: !0,
        mimetype: "audio/mpeg",
        fileName: rdm.split("/")[7] + ".mp3",
        waveform: [100, 0, 100, 0, 100, 0, 100]
      }, {
        quoted: m
      });
    }
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["mlsounden", "mlsoundid"], handler.tags = ["internet"], handler.command = /^mlsound(en|id)$/i;
export default handler;
async function MLSound(tema, query) {
  let res;
  "id" === tema && (res = await fetch("https://mobile-legends.fandom.com/wiki/" + query + "/Audio/id")),
    "en" === tema && (res = await fetch("https://mobilelegendsbuild.com/sound/" + query));
  let html = await res.text();
  var totals = new JSDOM(html).window.document.getElementsByTagName("audio");
  let audio = [];
  for (var i = 0; i < totals.length; i++) audio.push(totals[i].getAttribute("src"));
  return audio;
}