let handler = async (m, { conn }) => {
    try {
        let caption = `Waalaikummussalam warahmatullahi wabarokatuh

📚 Baca yang dibawah ya!
"Orang yang mengucapkan salam seperti ini maka ia mendapatkan 30 pahala, kemudian, orang yang dihadapan atau mendengarnya membalas dengan kalimat yang sama yaitu “Wa'alaikum salam warahmatullahi wabarakatuh” atau ditambah dengan yang lain (waridhwaana). Artinya selain daripada do'a selamat juga meminta pada Allah SWT"`;

        let author = 'Kirisaki'; // Replace 'Your Name' with the desired author name
        
        conn.sendButton(m.chat, caption, author, null, [
            ['Waalaikumsalam', 'Waalaikumsalam'],
        ], { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan dalam memproses permintaan.');
    }
};

handler.customPrefix = /^(assalamualaikum|salam)/i;
handler.command = new RegExp();
module.exports = handler;
