import {
  download as aptoideDown
} from "aptoide-scraper";
const handler = async (m, {
  conn,
  text
}) => {
  if (!/^[a-z]\w*(\.[a-z]\w*)+$/i.test(text)) throw "❌ Input package name";
  try {
    let aptodl = await aptoideDown(text);
    m.react(wait);
    let cap = `📦 *App Info* 📦\n\n` + `📌 *Name:* ${aptodl.name}\n` + `📦 *Package:* ${aptodl.package}\n` + `🕒 *Last Update:* ${aptodl.lastup}\n` + `📂 *Size:* ${aptodl.size}\n\n` + `⌛ *Please wait while the download link is being prepared...*`;
    await conn.sendFile(m.chat, aptodl.icon, "", cap, m);
    await conn.sendFile(m.chat, aptodl.dllink, aptodl.name, null, m, true, {
      quoted: m,
      mimetype: "application/vnd.android.package-archive"
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["aptoidedown"];
handler.tags = ["tools"];
handler.command = /^ap(ptoided(own|l)|toided(own|l))$/i;
export default handler;
