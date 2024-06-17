import { videoConvert } from "../../lib/converter.js";
const handler = async (m, { conn: conn, usedPrefix: usedPrefix, args: args, command: command }) => {
  if ("hdvid" === command) {
    conn.hdvid = conn.hdvid ? conn.hdvid : {};
    let error, q = m.quoted ? m.quoted : m,
      mime = q.mtype || "";
    if (!mime) throw "Fotonya Mana...?";
    if (!/videoMessage/g.test(mime)) throw `Mime ${mime} tidak support`;
    conn.hdvid[m.sender] = !0, m.react(wait);
    try {
      const additionalFFmpegOptions = ["-c:v", "libx264", "-crf", args[2] || "20", "-b:v", args[1] || "8M", "-s", args[0] || "720x1280", "-x264opts", "keyint=30:min-keyint=30"],
        videoBuffer = await (q?.download()),
        additionalArgs = [...additionalFFmpegOptions, "-q:v", args[3] || "30"],
        buff = await videoConvert(videoBuffer, additionalArgs);
      return m.reply(buff.data);
    } catch (er) {
      error = !0;
    } finally {
      error && m.reply("Proses Gagal :("), delete conn.hdvid[m.sender];
    }
  }
};
handler.help = ["hdvid"], handler.tags = ["tools"], handler.command = ["hdvid"];
export default handler;