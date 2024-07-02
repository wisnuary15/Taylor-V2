import emojiRegex from "emoji-regex";
const handler = async (m, {
  text
}) => {
  if (!text) return m.reply("Mohon berikan angka (1, 2, atau 3) sebagai pilihan prefix: 1 (noprefix), 2 (multiprefix), 3 (singleprefix).");
  const regexEmoji = emojiRegex();
  if (/^\d$/.test(text)) {
    const isNoPrefix = "1" === text,
      isMultiPrefix = "2" === text,
      isSinglePrefix = "3" === text;
    if (!isNoPrefix && !isMultiPrefix && !isSinglePrefix) return m.reply("Pilihan prefix yang Anda masukkan tidak valid. Pilihan tersedia: 1 (noprefix), 2 (multiprefix), 3 (singleprefix).");
    opts.noprefix = !!isNoPrefix;
    opts.multiprefix = !!isMultiPrefix;
    opts.singleprefix = !!isSinglePrefix;
    return m.reply(`Pilihan prefix telah diubah: ${isNoPrefix ? "noprefix" : isMultiPrefix ? "multiprefix" : "singleprefix"}`);
  } else {
    return m.reply("Input tidak valid. Mohon berikan angka (1, 2, atau 3) sebagai pilihan prefix: 1 (noprefix), 2 (multiprefix), 3 (singleprefix).");
  }
};
handler.help = ["setprefix"].map(v => v + " [prefix]");
handler.tags = ["owner"];
handler.command = /^(setprefix)$/i;
handler.rowner = true;
export default handler;
