import {
    OTP
} from "../../lib/welcome.js";
import {
    generate,
    generateV2
} from "../../lib/tools/captcha.js";
import {
    promises as fsPromises
} from 'fs';
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
    conn.registrasi = conn.registrasi || {};
    if (conn.registrasi[m.chat]) return conn.reply(m.chat, 'Anda masih berada dalam sesi Registrasi', conn.registrasi[m.chat].msg);
    let user = db.data.users[m.sender];
    if (user.banned) throw `[💬] Kamu sudah dibanned\nMau unbanned? *${usedPrefix}unban <NUMBER>*`;
    if (user.registered) throw `[💬] Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <SERIAL NUMBER>*`;
    const umurRandom = Math.floor(Math.random() * 100) + 1;
    const formatSalah = `⚠️ Format salah\n\n✳️ Penggunaan perintah : *${usedPrefix + command} nama.umur*\n📌Contoh : *${usedPrefix + command}* ${m.sender.split('@')[0]}.${umurRandom}`;
    if (!Reg.test(text)) throw formatSalah;
    let [_, name, splitter, age] = text.match(Reg);
    if (!name) throw "Nama tidak boleh kosong (Alphanumeric)";
    if (!age) throw "Umur tidak boleh kosong (Angka)";
    age = parseInt(age);
    if (age > 30) throw "*Gak boleh!*,\nTua amat dah 🗿";
    if (age < 5) throw "*Gak boleh!*,\nBanyak pedo 🗿";
    if (user.name && user.name.trim() === name.trim()) throw "Nama sudah dipakai";
    try {
        let sn = createHash("md5").update(m.sender).digest("hex");
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender;
        let pp = await conn.profilePictureUrl(who, "image").catch(_ => logo);
        let caption = `
*VERIFIKASI BERHASIL*

• *Nama:* ${name}
• *Umur:* ${age} tahun
• *Serial Number (SN):* ${sn}

Terima kasih telah melakukan verifikasi. Data pengguna telah disimpan dengan aman di database bot. Data kamu sekarang sudah terverifikasi.

🚀 Sekarang kamu dapat menggunakan fitur-fitur khusus yang hanya tersedia untuk pengguna terverifikasi.
`;
        const json = await createOtpCanvas(flaaa.getRandom() + "Sukses");
        let confirm = "💡 Reply pesan ini dengan mengetik kode OTP yang ada pada gambar!";
        let txt = `📝 *Registrasi* 📝\n\n@${m.sender.split('@')[0]}\n${confirm}\n\n_( Berlaku 1X )_`;
        let msg = await conn.sendMessage(m.chat, {
            image: json.image,
            caption: txt,
            mentions: [m.sender],
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
                });
                delete conn.registrasi[m.chat];
            }, 60 * 1000)
        };
    } catch (e) {
        console.error(e);
        m.reply(e);
    }
};
handler.help = ["daftar", "register"]?.map(v => v + " <nama>.<umur>");
handler.tags = ["xp"];
handler.command = /^(register|verify|daftar|reg(is)?|verif)$/i;
export default handler;
async function createOtpCanvas(inSucc) {
    try {
        const captcha = await generate(6) || await generateV2({});
        const captchaBuffer = captcha.buffer
        const secur = OTP(inSucc);
        const res2 = await fetch(secur);
        const securityBuffer = Buffer.from(await res2.arrayBuffer());
        return {
            image: captchaBuffer,
            otp: captcha.code,
            verified: securityBuffer
        };
    } catch (e) {
        try {
            const otp = randomBytes(4).toString('hex').slice(0, 4);
            const captcha = OTP(otp);
            const res = await fetch(captcha);
            const captchaBuffer = Buffer.from(await res.arrayBuffer());
            const secur = OTP(inSucc);
            const res2 = await fetch(secur);
            const securityBuffer = Buffer.from(await res2.arrayBuffer());
            return {
                image: captchaBuffer,
                otp: otp,
                verified: securityBuffer
            };
        } catch (e) {
            console.error(e);
        }
    }
}
