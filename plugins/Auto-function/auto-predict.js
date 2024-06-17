import uploadImage from "../../lib/uploadImage.js";
import axios from "axios";
export async function before(m, { isAdmin: isAdmin, isBotAdmin: isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup || !db.data.chats[m.chat].nsfw) return !1;
  const q = m.quoted || m,
    mime = q.msg?.mimetype || "";
  if (!mime) return !1;
  if (!/image\/(png|jpe?g)/.test(mime)) return !1;
  const media = await (q?.download()),
    link = await uploadImage(media);
  if (link) {
    const detect = await cekGambar(link);
    if (detect.nsfw) return void await this.reply(m.chat, detect.msg, m);
  }
}
async function cekGambar(img) {
  try {
    const response = await axios.get("https://api.sightengine.com/1.0/check.json", {
        params: {
          url: img,
          models: "nudity,wad,gore",
          api_user: "671718818",
          api_secret: "zs9QqkjFYZWq5N3nozXT"
        }
      }),
      estetikPesan = "*Peringatan Keamanan:*\nDitemukan pesan dengan konten NSFW di saluran yang diizinkan.\nLangkah pencegahan akan diambil terhadap pengguna.";
    return {
      nsfw: response.data.nudity.safe < .8,
      msg: estetikPesan
    };
  } catch (error) {
    console.error("Kesalahan dalam pemeriksaan gambar:", error);
  }
}