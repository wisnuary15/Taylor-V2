const handler = async (m) => {
    try {
        const {
            users
        } = global.db.data;
        const total = Object.keys(users).length;
        const registered = Object.values(users).reduce((acc, user) => user.registered ? acc + 1 : acc, 0);
        m.reply(`🔍 *Informasi Database* 🔍\n\n👥 Jumlah pengguna database saat ini: ${total} user\n✔️ Jumlah pengguna terdaftar: ${registered} user`);
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat mengambil informasi database.');
    }
};

handler.help = ['database', 'user'];
handler.tags = ['info'];
handler.command = /^(database|jumlahdatabase|user)$/i;
handler.limit = true;

export default handler;