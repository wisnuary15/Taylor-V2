import moment from 'moment-timezone';

export async function before(m) {
    if (m.chat.endsWith('broadcast') || m.fromMe || m.isGroup) return;

    try {
        const time = moment.tz('Asia/Jakarta').format('HH');
        const greeting = time < 4 ? "Selamat dinihari 🌆" :
                         time < 10 ? "Selamat pagi 🌄" :
                         time < 15 ? "Selamat siang ☀️" :
                         time < 18 ? "Selamat sore 🌇" :
                         "Selamat malam 🌙";

        let user = global.db.data.users[m.sender];
        let txt = `👋 Hai, ${greeting}

${user.banned ? '📮Maaf, kamu dibanned & Tidak bisa menggunakan bot ini lagi' : `💬 Ada yg bisa ${this.user.name} bantu?\nSilahkan ketik *.menu* untuk melihat daftar menu pada bot.`}`.trim();

        if (new Date() - user.pc < 21600000) return;
        await this.reply(m.chat, txt, null);
        user.pc = Date.now();
    } catch (e) {
        console.error(e);
    }
}
