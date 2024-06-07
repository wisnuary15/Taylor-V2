import fetch from "node-fetch";
import dhn from 'dhn-api';
const handler = async (m, {
  conn
}) => {
  try {
    const response = await dhn.KompasNews();
    const data = await response.json();
    const news = data.getRandom();
    const {
      berita,
      berita_url,
      berita_thumb,
      berita_jenis,
      berita_diupload
    } = news;
    const message = `📺 *Kompas News*

📢 *Berita:* ${berita}
📁 *Type News:* ${berita_jenis}
⌚ *Uploaded:* ${berita_diupload}
🛰 *Source Url:* ${berita_url}`;
    conn.sendFile(m.chat, berita_thumb, '', message, m);
  } catch (error) {
    console.error(error);
    throw 'Gagal mengambil berita, coba lagi nanti.';
  }
};
handler.help = ['kompasnews'];
handler.tags = ['berita'];
handler.command = /^kompas(news)?$/i;
handler.limit = true;
export default handler;
