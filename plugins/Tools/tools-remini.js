import fetch from "node-fetch";
import uploadImage from "../../lib/uploadImage.js";
import {
  remini
} from "../../lib/scraper/scraper-tool.js";
const handler = async (m, {
  conn
}) => {
  try {
    const q = m.quoted || m,
      mime = (q.msg || q).mimetype || "";
    if (!/image/g.test(mime) || /webp/g.test(mime)) throw new Error("Reply imagenya");
    {
      const img = await q?.download(),
        out = await uploadImage(img),
        response = await remini(out, "m3yl4zGsURJtiODuVl4OnGhrwfgMwtTnTlaLmYJHW34UhB02");
      response && await conn.sendFile(m.chat, response, "", "*[ REMINI ]*", m);
    }
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["remini"], handler.tags = ["tools"], handler.command = ["remini"];
export default handler;