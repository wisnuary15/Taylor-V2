import { generateWAMessageFromContent } from "@whiskeysockets/baileys";
import moment from "moment-timezone";
const handler = async (m, { conn: conn, groupMetadata: groupMetadata, usedPrefix: _p, command: command }) => {
  await conn.sendReact(m.chat, "⏳", m.key);
  ["aku-ngakak", "anjay", "ara-ara2", "ara-ara-cowok", "ara-ara", "arigatou", "assalamualaikum", "asu", "ayank", "bacot", "bahagia-aku", "baka", "bansos", "beat-box2", "beat-box", "biasalah", "bidadari", "bot", "buka-pintu", "canda-anjing", "cepetan", "china", "cuekin-terus", "daisuki-dayo", "daisuki", "dengan-mu", "Donasiku", "gaboleh-gitu", "gak-lucu", "gamau", "gay", "gelay", "gitar", "gomenasai", "hai-bot", "hampa", "hayo", "hp-iphone", "ih-wibu", "i-like-you", "india", "karna-lo-wibu", "kiss", "kontol", "ku-coba", "maju-wibu", "makasih", "mastah", "menuasli", "menuku", "menu", "MenuYuki", "nande-nande", "nani", "ngadi-ngadi", "nikah", "nuina", "onichan", "ownerku", "owner-sange", "pak-sapardi", "pale", "pantek", "pasi-pasi", "punten", "sayang", "siapa-sih", "sudah-biasa", "summertime", "tanya-bapak-lu", "to-the-bone", "wajib", "waku", "woi", "yamete", "yowaimo", "yoyowaimo"].getRandom();
  const caption = `${m.name || ""} - @${m.sender.split("@")[0]} ${ucapan()}\n*\`🌟 Selamat datang di dashboard bot pertama kami\`*!\n\n> ────────────────\n- 1. Kami harap Anda menikmati pengalaman pertama berinteraksi dengan chatbot kami yang ramah dan intuitif. ${readMore}\n\n- 2. Kami telah menyertakan berbagai fitur untuk membantu Anda mengelola dan meningkatkan kinerja bot Anda.\n\n- 3. Semoga Anda menikmati menggunakan dashboard chatbot kami dan mendapatkan manfaat dari fitur-fitur yang kami tawarkan.\n> ────────────────\n\n\n         *\`[ LIST MENU ]\`*\n- ${_p}menulist\n- ${_p}allmenu\n`;
  conn.temamenu = conn.temamenu ? conn.temamenu : {
    id: 0
  }, 0 === conn.temamenu.id && await conn.sendButtonMessages(m.chat, [
    [caption, wm, logo, [
      ["Menu List", _p + "menulist"]
    ], null, [
      ["Official Group", sgc]
    ], null]
  ], m, {
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }), 1 === conn.temamenu.id ? await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }) : 2 === conn.temamenu.id ? await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: ucapan() + " " + m.name,
        thumbnail: await conn.resize([logo, imagebot].getRandom(), 300, 150)
      }
    }
  }) : 3 === conn.temamenu.id ? await conn.reply(m.chat, caption, m, {
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: ucapan() + " " + m.name,
        body: bottime,
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: !0,
        thumbnailUrl: [logo, imagebot].getRandom(),
        sourceUrl: ""
      }
    }
  }) : 4 === conn.temamenu.id ? await conn.sendFile(m.chat, Buffer.alloc(0), "D A S H B O A R D", caption, fakes, !1, {
    mimetype: [dpptx, ddocx, dxlsx, dpdf, drtf].getRandom(),
    fileLength: fsizedoc,
    pageCount: fpagedoc,
    jpegThumbnail: await conn.resize([thumbdoc, thumb].getRandom(), 300, 150),
    contextInfo: {
      mentionedJid: [m.sender]
    }
  }) : 5 === conn.temamenu.id ? await conn.sendFile(m.chat, Buffer.alloc(0), "D A S H B O A R D", caption, fakes, !1, {
    mimetype: [dpptx, ddocx, dxlsx, dpdf, drtf].getRandom(),
    fileLength: fsizedoc,
    pageCount: fpagedoc,
    jpegThumbnail: await conn.resize([thumbdoc, thumb].getRandom(), 300, 150),
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: ucapan() + " " + m.name,
        thumbnail: await conn.resize([logo, imagebot].getRandom(), 300, 150)
      }
    }
  }) : 6 === conn.temamenu.id ? await conn.sendFile(m.chat, Buffer.alloc(0), "D A S H B O A R D", caption, fakes, !1, {
    mimetype: [dpptx, ddocx, dxlsx, dpdf, drtf].getRandom(),
    fileLength: fsizedoc,
    pageCount: fpagedoc,
    jpegThumbnail: await conn.resize([thumbdoc, thumb].getRandom(), 300, 150),
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: ucapan() + " " + m.name,
        body: bottime,
        mediaType: 1,
        previewType: 0,
        renderLargerThumbnail: !0,
        thumbnailUrl: [logo, imagebot].getRandom(),
        sourceUrl: ""
      }
    }
  }) : 7 === conn.temamenu.id ? await conn.relayMessage(m.chat, {
    requestPaymentMessage: {
      currencyCodeIso4217: "INR",
      amount1000: fsizedoc,
      requestFrom: "0@s.whatsapp.net",
      noteMessage: {
        extendedTextMessage: {
          text: caption,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              showAdAttribution: !0
            }
          }
        }
      }
    }
  }, {}) : 8 === conn.temamenu.id && await conn.sendMessage(m.chat, {
    video: {
      url: giflogo
    },
    caption: caption,
    gifPlayback: !0,
    gifAttribution: Math.floor(2 * Math.random()) + 1
  }, {
    quoted: m
  }), await conn.sendReact(m.chat, "✅", m.key);
};
handler.help = ["menu", "?"], handler.tags = ["main"], handler.command = /^(menu|\?)$/i;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001);

function ucapan() {
  let waktunya = moment.tz("Asia/Makassar").format("HH");
  return waktunya >= 24 ? "Selamat Begadang 🗿" : waktunya >= 18 ? "Selamat malam 🌙" : waktunya >= 15 ? "Selamat sore 🌅" : waktunya > 10 ? "Selamat siang ☀️" : waktunya >= 4 ? "Selamat pagi 🌄" : "Selamat Pagi 🗿";
}