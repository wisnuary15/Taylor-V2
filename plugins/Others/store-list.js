const handler = async (m, {
  conn,
  usedPrefix,
  command
}) => {
  try {
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    const name = conn.getName(who);
    const chat = db.data.chats[m.chat];
    const msgs = db.data.msgs;
    const msg = Object.entries(msgs).map(([nama, isi]) => ({
      nama: nama,
      ...isi
    }));
    if (!chat.getmsg) {
      return await conn.reply(m.chat, `Kamu harus mengaktifkan getmsg dengan mengetik *${usedPrefix}getmsg <teks>*`, m);
    }
    if (msg.length === 0) {
      return await conn.reply(m.chat, `Belum ada Menu yang ada di list store.\nKetik *${usedPrefix}addstore <teks>* untuk menambahkan daftar menu.`, m);
    }
    const listSections = msg.map((v, index) => [`${htki} ${index + 1} ${htka}`, [
      [`Pesan: ${v.nama}`, `${usedPrefix}getmsg ${v.nama}`, `\n\n${htjava}\n${dmenub} *ID:* ${v.key.id}\n${dmenub} *Type:* ${Object.keys(v.message)}\n${dmenub} *Jid:* ${v.key.remoteJid.replace(/@.+/, "")}\n${dmenuf}`]
    ]]);
    await conn.sendList(m.chat, `${htki} 📺 LIST STORE 🔎 ${htka}`, `⚡ Hai ${name}, berikut daftar Menu yang ada di List store...\nAkses langsung dengan mengetik namanya`, author, `☂️ ${command} Klik Disini ☂️`, listSections, m);
  } catch (error) {
    await conn.reply(m.chat, error, m);
  }
};
handler.help = ["store"].map(v => `list${v}`);
handler.tags = ["database"];
handler.command = ["liststore"];
export default handler;