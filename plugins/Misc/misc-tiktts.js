import {
  tiktokTts,
  ttsModel
} from "../../lib/scraper/scraper-toolv2.js";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  const data = await ttsModel();
  let [urutan, tema] = text.split("|");
  const mesg = "Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n");
  if (!tema) return m.reply();
  m.react(wait);
  try {
    if (!urutan) return m.reply(mesg);
    if (isNaN(urutan)) return m.reply(mesg);
    if (urutan > data.length) return m.reply(mesg);
    let out = data[urutan - 1].id;
    const res = await tiktokTts(tema, out);
    res ? await conn.sendFile(m.chat, res.data, "audio.mp3", "", m, !0, {
      mimetype: "audio/mp4",
      ptt: !0,
      waveform: [100, 0, 100, 0, 100, 0, 100],
      contextInfo: {
        ...adReply.contextInfo,
        mentionedJid: [m.sender],
        externalAdReply: {
          ...adReply.contextInfo.externalAdReply,
          title: "TEXT TO SPEECH",
          body: "",
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: "https://www.respeecher.com/hs-fs/hubfs/What-is-Text-to-Speech-TTS%29-Initial-Speech-Synthesis-Explained-Respeecher-voice-cloning-software.jpeg?width=1191&height=744&name=What-is-Text-to-Speech-TTS%29-Initial-Speech-Synthesis-Explained-Respeecher-voice-cloning-software.jpeg",
          sourceUrl: ""
        }
      }
    }) : console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["tiktts *[nomor]|[query]*"], handler.tags = ["ai"], handler.command = /^(tiktts)$/i;
export default handler;