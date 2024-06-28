import axios from "axios";
import {
  download
} from "aptoide-scraper";
const handler = async (m, {
  conn,
  text,
  command,
  usedPrefix
}) => {
  if (!/^[a-z]\w*(\.[a-z]\w*)+$/i.test(text)) throw "Input package name";
  try {
    let aptodl = await download(text);
    m.react(wait);
    let {
      name,
      lastup,
      size,
      icon,
      dllink
    } = aptodl, cap = "*Name:* " + name + "\n*Lastup:* " + lastup + "\n*Size:* " + size + "\n\n" + wait;
    await conn.sendFile(m.chat, icon, "", cap, m), await conn.sendFile(m.chat, dllink, name, null, m, !0, {
      quoted: m,
      mimetype: "application/vnd.android.package-archive"
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["aptoidedown"], handler.tags = ["tools"], handler.command = /^ap(ptoided(own|l)|toided(own|l))$/i;
export default handler;