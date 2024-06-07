import axios from "axios";
import {
  sticker
} from "../../lib/sticker.js";
import wibusoft from "wibusoft";
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  let who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender);
  let name = conn.getName(who);
  let reply = m.quoted ? {
    name: conn.getName(m.quoted?.sender),
    text: m.quoted?.text || '',
    id: m.chat?.split('@')[0]
  } : null;
  text = text || m.quoted?.text;
  if (!text) throw "Input teks atau reply teks yang ingin dijadikan quote!";
  m.react(wait);
  let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => logo);
  let theme = command === "quotly" ? "terang" : command === "quotlyv2" ? "gelap" : "random";
  let result = await Quotly(name, pp, text, theme, reply);
  try {
    let out = await wibusoft.tools.makeSticker(result, {
      author: packname,
      pack: name,
      keepScale: true
    });
    m.reply(out);
  } catch (e) {
    let stick = await sticker(result, false, name, packname);
    conn.sendFile(m.chat, stick, "Quotly.webp", "", m);
  }
};
handler.help = ["quotly", "quotlyv2", "quotlyv3"];
handler.tags = ["sticker"];
handler.command = /^(quotly|quotlyv2|quotlyv3)$/i;
export default handler;
async function Quotly(name, photoUrl, text, theme, reply) {
  const getRandomHexColor = () =>
    `#${[...Array(3)].map(() => Math.floor(Math.random() * 200).toString(16).padStart(2, "0")).join('')}`;
  const backgroundColor = theme === "terang" ? "#ffffff" : theme === "gelap" ? "#1b1429" : getRandomHexColor();
  const obj = {
    type: "quote",
    format: "png",
    backgroundColor,
    width: 512,
    height: 768,
    scale: 2,
    messages: [{
      entities: [],
      avatar: true,
      from: {
        id: 1,
        name,
        photo: {
          url: photoUrl
        }
      },
      text,
      ...(reply ? {
        replyMessage: reply
      } : {})
    }]
  };
  try {
    const response = await axios.post("https://quote.btch.bz/generate", obj, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return Buffer.from(response.data?.result?.image, "base64");
  } catch (e) {
    console.error('Quotly Error:', e);
    try {
      const fallbackResponse = await axios.post("https://quotly.netorare.codes/generate", obj, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return Buffer.from(fallbackResponse.data?.result?.image, "base64");
    } catch (e) {
      console.error('Quotly Error (Backup):', e);
      throw new Error('Error generating quote image');
    }
  }
}
