import {
  OTP
} from "../../lib/welcome.js";
import {
  generate,
  generateV1,
  generateV2
} from "../../lib/tools/captcha.js";
import {
  promises as fsPromises
} from "fs";
import {
  createHash,
  randomBytes
} from "crypto";
import fetch from "node-fetch";
let Reg = /\|?(.*)([^\w\s])([0-9]*)$/i;
const handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  if (conn.registrasi = conn.registrasi || {}, conn.registrasi[m.chat]) return await conn.reply(m.chat, "Anda masih berada dalam sesi Registrasi", conn.registrasi[m.chat].msg);
  let user = db.data.users[m.sender];
  if (user.banned) throw `[💬] Kamu sudah dibanned\nMau unbanned? *${usedPrefix}unban <NUMBER>*`;
  if (user.registered) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`;
  const umurRandom = Math.floor(100 * Math.random()) + 1,
    formatSalah = `⚠️ Format salah\n\n✳️ Penggunaan perintah : *${usedPrefix + command} nama.umur*\n📌Contoh : *${usedPrefix + command}* ${m.sender.split("@")[0]}.${umurRandom}`;
  let namae = await conn.getName(m.sender);
  let namamu = namae ? namae : "Gapunya Nama";
  const sections = [{
    title: htjava + " 𝗣𝗶𝗹𝗶𝗵 𝗨𝗺𝘂𝗿 𝗞𝗮𝗺𝘂 " + htjava,
    rows: [{
      title: " A C A K ",
      id: ".daftar " + namamu + "." + ["30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9"].getRandom()
    }]
  }, {
    title: htki + " 𝗦𝗨𝗗𝗔𝗛 𝗧𝗨𝗔 " + htka,
    rows: [{
      title: emojis + " 30 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".30 "
    }, {
      title: emojis + " 29 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".29 "
    }, {
      title: emojis + " 28 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".28 "
    }, {
      title: emojis + " 27 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".27 "
    }, {
      title: emojis + " 26 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".26 "
    }, {
      title: emojis + " 25 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".25 "
    }, {
      title: emojis + " 24 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".24 "
    }, {
      title: emojis + " 23 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".23 "
    }, {
      title: emojis + " 22 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".22 "
    }, {
      title: emojis + " 21 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".21 "
    }]
  }, {
    title: htki + " 𝗠𝗔𝗦𝗜𝗛 𝗠𝗨𝗗𝗔 " + htka,
    rows: [{
      title: emojis + " 20 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".20 "
    }, {
      title: emojis + " 19 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".19 "
    }, {
      title: emojis + " 18 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".18 "
    }, {
      title: emojis + " 17 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".17 "
    }, {
      title: emojis + " 16 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".16 "
    }, {
      title: emojis + " 15 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".15 "
    }, {
      title: emojis + " 14 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".14 "
    }, {
      title: emojis + " 13 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".13 "
    }, {
      title: emojis + " 12 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".12 "
    }, {
      title: emojis + " 11 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".11 "
    }, {
      title: emojis + " 10 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".10 "
    }, {
      title: emojis + " 9 ᴛᴀʜᴜɴ",
      id: ".daftar " + namamu + ".9 "
    }]
  }];
  const listMessage = {
    text: "Please select your age at the bottom button...",
    footer: formatSalah,
    title: htki + " ʀᴇɢɪsᴛᴇʀ " + htka,
    buttonText: "Click Here !",
    sections: sections
  };
  if (user.registered === true) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`;
  await m.reply(conn.user.name + " mengirim form verifikasi ke nomor anda...");
  if (!Reg.test(text)) return await conn.sendList(m.sender, listMessage.title, listMessage.text, listMessage.footer, listMessage.buttonText, null, sections, m);
  let [_, name, splitter, age] = text.match(Reg);
  if (!name) throw "Nama tidak boleh kosong (Alphanumeric)";
  if (!age) throw "Umur tidak boleh kosong (Angka)";
  if (age = parseInt(age), age > 30) throw "*Gak boleh!*,\nTua amat dah 🗿";
  if (age < 5) throw "*Gak boleh!*,\nBanyak pedo 🗿";
  if (user.name && user.name.trim() === name.trim()) throw "Nama sudah dipakai";
  try {
    let sn = createHash("md5").update(m.sender).digest("hex"),
      who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted?.sender : m.fromMe ? conn.user.jid : m.sender,
      caption = (await conn.profilePictureUrl(who, "image").catch(_ => logo), `\n*VERIFIKASI BERHASIL*\n\n• *Nama:* ${name}\n• *Umur:* ${age} tahun\n• *Serial Number (SN):* ${sn}\n\nTerima kasih telah melakukan verifikasi. Data pengguna telah disimpan dengan aman di database bot. Data kamu sekarang sudah terverifikasi.\n\n🚀 Sekarang kamu dapat menggunakan fitur-fitur khusus yang hanya tersedia untuk pengguna terverifikasi.\n`);
    const json = await createOtpCanvas(flaaa.getRandom() + "Sukses");
    let confirm = "💡 Reply pesan ini dengan mengetik kode OTP yang ada pada gambar!",
      txt = `📝 *Registrasi* 📝\n\n@${m.sender.split("@")[0]}\n${confirm}\n\n_( Berlaku 1X )_`,
      msg = await conn.sendMessage(m.chat, {
        image: json.image,
        caption: txt,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    conn.registrasi[m.chat] = {
      OTP: json.otp,
      VERIFIED: json.verified,
      CAPTION: caption,
      MSG: msg,
      NAME: name,
      AGE: age,
      timeout: setTimeout(() => {
        conn.sendMessage(m.chat, {
          delete: msg.key
        }), delete conn.registrasi[m.chat];
      }, 6e4)
    };
  } catch (e) {
    console.error(e), m.reply(e);
  }
};
handler.help = ["daftar", "register"].map(v => v + " <nama>.<umur>"), handler.tags = ["xp"],
  handler.command = /^(register|verify|daftar|reg(is)?|verif)$/i;
export default handler;
async function createOtpCanvas(inSucc) {
  try {
    const captcha = await generateV2(4) || await generateV1(4) || await generate(4),
      captchaBuffer = captcha.buffer,
      secur = OTP(inSucc),
      res2 = await fetch(secur),
      securityBuffer = Buffer.from(await res2.arrayBuffer());
    return {
      image: captchaBuffer,
      otp: captcha.code,
      verified: securityBuffer
    };
  } catch (e) {
    try {
      const otp = randomBytes(4).toString("hex").slice(0, 4),
        captcha = OTP(otp),
        res = await fetch(captcha),
        captchaBuffer = Buffer.from(await res.arrayBuffer()),
        secur = OTP(inSucc),
        res2 = await fetch(secur);
      return {
        image: captchaBuffer,
        otp: otp,
        verified: Buffer.from(await res2.arrayBuffer())
      };
    } catch (e) {
      console.error(e);
    }
  }
}