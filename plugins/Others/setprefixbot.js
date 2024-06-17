import emojiRegex from 'emoji-regex';

const handler = async (m, { text }, opts) => {
  if (!text) return m.reply("Mohon berikan angka (1 atau 2) sebagai pilihan prefix: 1 (noprefix), 2 (multiprefix).");

  const regexEmoji = emojiRegex();
  
  if (/^\d$/.test(text)) {
    const isNoPrefix = "1" === text,
          isMultiPrefix = "2" === text;
    
    if (!isNoPrefix && !isMultiPrefix) return m.reply("Pilihan prefix yang Anda masukkan tidak valid. Pilihan tersedia: 1 (noprefix), 2 (multiprefix).");
    
    opts.noprefix = !!isNoPrefix;
    opts.multiprefix = !!isMultiPrefix;
    
    return m.reply(`Pilihan prefix telah diubah: ${isNoPrefix ? "noprefix" : "multiprefix"}`);
  } else {
    return m.reply("Input tidak valid. Mohon berikan angka (1 atau 2) sebagai pilihan prefix: 1 (noprefix), 2 (multiprefix).");
  }
};

handler.help = ["setprefix"].map((v => v + " [prefix]"));
handler.tags = ["owner"];
handler.command = /^(setprefix)$/i;
handler.rowner = true;

export default handler;
