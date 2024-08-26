import {
  OTP
} from "../../lib/welcome.js";
import {
  generate,
  generateV1,
  generateV2,
  generateV3
} from "../../lib/tools/captcha.js";
import {
  createHash,
  randomBytes
} from "crypto";
import fetch from "node-fetch";
import _ from "lodash";
const Reg = /\|?(.*)([^\w\s])([0-9]*)$/i;
const handler = async (m, {
  conn,
  usedPrefix,
  command,
  text
}) => {
  conn.registrasi = conn.registrasi || {};
  if (conn.registrasi[m.sender]) {
    return await conn.reply(m.sender, "⚠️ Kamu masih dalam proses registrasi. Selesaikan dulu ya!", conn.registrasi[m.sender].msg);
  }
  let user = db.data.users[m.sender];
  if (user.banned) {
    return await conn.reply(m.chat, `🚫 Kamu telah dibanned.\nIngin menghapus ban? Ketik *${usedPrefix}unban <NOMOR>*`, m);
  }
  if (user.registered) {
    return await conn.reply(m.chat, `✅ Kamu sudah terdaftar.\nMau daftar ulang? Ketik *${usedPrefix}unreg <NOMOR SERIAL>*`, m);
  }
  const umurRandom = _.random(1, 100);
  const formatSalah = `⚠️ Format salah!\n\n📌 Gunakan perintah seperti ini: *${usedPrefix + command} nama.umur*\n\n📝 Contoh: *${usedPrefix + command}* ${m.sender.split("@")[0]}.${umurRandom}`;
  let namae = await conn.getName(m.sender);
  let namamu = namae || "Tanpa Nama";
  const sections = [{
    title: `🔢 Pilih Umur Kamu`,
    rows: [{
      title: "🎲 Acak Umur",
      id: `.daftar ${namamu}.${_.sample([ "30", "29", "28", "27", "26", "25", "24", "23", "22", "21", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9" ])}`
    }]
  }, {
    title: `🧓 Sudah Tua`,
    rows: _.map([30, 29, 28, 27, 26, 25, 24, 23, 22, 21], age => ({
      title: `${age} Tahun`,
      id: `.daftar ${namamu}.${age} `
    }))
  }, {
    title: `👶 Masih Muda`,
    rows: _.map([20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9], age => ({
      title: `${age} Tahun`,
      id: `.daftar ${namamu}.${age} `
    }))
  }];
  const listMessage = {
    text: "Silakan pilih umur kamu dari tombol di bawah ini...",
    footer: formatSalah,
    title: `📝 Pendaftaran`,
    buttonText: "Pilih Umur",
    sections: sections
  };
  if (!Reg.test(text)) {
    return await conn.sendList(m.chat, listMessage.title, listMessage.text, listMessage.footer, listMessage.buttonText, null, sections, m);
  }
  let [, name, , age] = text.match(Reg);
  if (!name) {
    return await conn.reply(m.chat, "⚠️ Nama tidak boleh kosong. Gunakan hanya huruf dan angka.", m);
  }
  if (!age) {
    return await conn.reply(m.chat, "⚠️ Umur tidak boleh kosong. Masukkan angka saja.", m);
  }
  age = parseInt(age);
  if (age > 99) {
    return await conn.reply(m.chat, "⚠️ Umur kamu terlalu tua. Batas maksimal 99 tahun.", m);
  }
  if (age < 5) {
    return await conn.reply(m.chat, "⚠️ Umur kamu terlalu muda. Batas minimal 5 tahun.", m);
  }
  let sn = createHash("md5").update(m.sender).digest("hex");
  let who = _.get(m, "mentionedJid[0]") || _.get(m, "quoted.sender") || (m.fromMe ? conn.user.jid : m.sender);
  let caption = `🎉 *Selamat! Kamu telah berhasil terdaftar.*\n\n📛 *Nama:* ${name}\n🎂 *Umur:* ${age} tahun\n🔑 *Nomor Serial (SN):* ${sn}\n\n🔓 Data kamu aman di database kami dan kamu sekarang bisa menggunakan semua fitur yang tersedia untuk pengguna terverifikasi.`;
  try {
    const {
      image,
      otp,
      verified
    } = await createOtpCanvas("Sukses", sn);
    let confirm = "📝 Silakan balas pesan ini dengan kode OTP yang tertera pada gambar.";
    let txt = `📝 *Proses Verifikasi* 📝\n\n@${m.sender.split("@")[0]}\n${confirm}\n\n_(Kode OTP berlaku sekali saja)_`;
    let msg = await conn.sendMessage(m.sender, {
      image: image,
      caption: txt,
      mentions: [m.sender]
    }, {
      quoted: m
    });
    conn.registrasi[m.sender] = {
      OTP: otp,
      VERIFIED: verified,
      CAPTION: caption,
      MSG: msg,
      NAME: name,
      AGE: age,
      timeout: setTimeout(() => {
        conn.sendMessage(m.sender, {
          delete: msg.key
        });
        delete conn.registrasi[m.sender];
      }, 6e4)
    };
    await conn.reply(m.chat, "📨 Form verifikasi telah dikirim ke chat pribadi kamu. Cek segera!", m);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "⚠️ Terjadi kesalahan saat mengirim form verifikasi. Coba lagi nanti.", m);
  }
};
handler.help = ["daftar", "register"].map(v => `${v} <nama>.<umur>`);
handler.tags = ["xp"];
handler.command = /^(register|verify|daftar|reg(is)?|verif)$/i;
export default handler;
async function createOtpCanvas(inSucc, seri) {
  seri = seri.slice(0, 6);
  try {
    const captcha = await generateV3(seri) || await generateV2(seri) || await generateV1(seri) || await generate(seri);
    const captchaBuffer = captcha.buffer;
    const securityBuffer = (await generateV3(inSucc) || await generateV2(inSucc) || await generateV1(inSucc) || await generate(inSucc))?.buffer;
    return {
      image: captchaBuffer,
      otp: captcha.code,
      verified: securityBuffer
    };
  } catch (e) {
    console.error(e);
    try {
      const otp = randomBytes(6).toString("hex").slice(0, 6);
      const captcha = OTP(otp);
      const res = await fetch(captcha);
      const captchaBuffer = Buffer.from(await res.arrayBuffer());
      const secur = OTP(inSucc);
      const res2 = await fetch(secur);
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