const handler = async (m, {
  conn,
  usedPrefix
}) => {
  try {
    let id = m.chat;
    db.data.database.absen = db.data.database.absen || {}, id in db.data.database.absen ? (delete db.data.database.absen[id], m.reply("Berhasil menghapus absen!")) : await conn.reply(m.chat, `_*Tidak ada absen berlangsung di grup ini!*_\n\n*${usedPrefix}mulaiabsen* - untuk memulai absen`, m);
  } catch (error) {
    console.error(error), m.reply("Terjadi kesalahan dalam memproses perintah.");
  }
};
handler.help = ["hapusabsen"], handler.tags = ["absen"], handler.command = /^(delete|hapus)absen$/i,
  handler.group = !0, handler.admin = !0;
export default handler;