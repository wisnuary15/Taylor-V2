import {
  FontList,
  FontListV2
} from "../../lib/fancy-text.js";
const handler = async (m, {
  conn,
  command,
  text
}) => {
  conn.temafont = conn.temafont || null;
  if (text) {
    const themeIndex = parseInt(text);
    if (isNaN(themeIndex)) {
      const fontList = await getFontList();
      await conn.sendMessage(m.chat, {
        text: `Input tidak valid. Silakan pilih tema dari daftar berikut:\n${fontList.map((v, i) => `*${i + 1}.* ${v.text} - ${v.name}`).join('\n')}`
      }, {
        quoted: m
      });
      return;
    }
    conn.temafont = themeIndex === 0 ? null : themeIndex;
    conn.reply(m.chat, `Tema berhasil diatur\n${themeIndex}`, m);
  } else {
    const fontList = await getFontList();
    await conn.sendMessage(m.chat, {
      text: `Input tidak valid. Silakan pilih tema dari daftar berikut:\n${fontList.map((v, i) => `*${i + 1}.* ${v.text} - ${v.name}`).join('\n')}`
    }, {
      quoted: m
    });
    return;
  }
};
handler.help = ['temafont'];
handler.tags = ['owner'];
handler.command = /^(temafont)$/i;
handler.owner = true;
export default handler;
const getFontList = async () => {
  try {
    const LfontV2 = await FontListV2();
    return LfontV2;
  } catch (error) {
    try {
      const Lfont = await FontList("Example");
      return Lfont;
    } catch (error) {
      console.log("Error");
    }
  }
};
