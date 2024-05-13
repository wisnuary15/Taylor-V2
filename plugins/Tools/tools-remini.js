import fetch from "node-fetch";
import uploadImage from "../../lib/uploadImage.js";
import {
    remini
} from "../../lib/scraper/scraper-tool.js";

let handler = async (m, {
    conn
}) => {
    try {
        const q = m.quoted || m;
        const mime = (q.msg || q).mimetype || "";

        if (/image/g.test(mime) && !/webp/g.test(mime)) {
            const img = await q.download?.();
            const out = await uploadImage(img);
            const response = await remini(out, 'm3yl4zGsURJtiODuVl4OnGhrwfgMwtTnTlaLmYJHW34UhB02');

            if (response) {
                await conn.sendFile(m.chat, response, "", "*[ REMINI ]*", m);
            }
        } else {
            throw new Error("Reply imagenya");
        }
    } catch (e) {
        await m.reply(eror);
    }
};

handler.help = ["remini"];
handler.tags = ["tools"];
handler.command = ["remini"];
export default handler;