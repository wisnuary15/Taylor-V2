const handler = async (m, { conn: conn }) => {
  new Date - db.data.users[m.sender].lastnguli > 864e5 ? (db.data.users[m.sender].limit += 10,
    m.reply("_Selamat kamu mendapatkan +10 limit_"), db.data.users[m.sender].lastnguli = 1 * new Date) : m.reply("Anda sudah mengklaim upah nguli hari ini");
};
handler.help = ["nguli"], handler.tags = ["rpg"], handler.command = /^(nguli)$/i,
  handler.group = !0, handler.fail = null;
export default handler;