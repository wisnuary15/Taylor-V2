import {
  listVoices,
  synthesize
} from "../../lib/tools/elevenlabs.js";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  const input_data = await listVoices();
  let [urutan, tema] = text.split("|");
  if (!tema) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]");
  m.react(wait);
  try {
    let data = input_data.voices;
    if (!urutan) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"));
    if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"));
    if (urutan > data.length) return m.reply("Input query!\n*Example:*\n" + usedPrefix + command + " [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.name}`).join("\n"));
    let out = data[urutan - 1].voice_id;
    const res = await synthesize({
      model_id: "e1",
      output_format: "mp3_44100_128",
      voice_id: out,
      text: tema
    });
    res ? await conn.sendFile(m.chat, res, "audio.mp3", "", m, !0, {
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
handler.help = ["elevenlabs *[nomor]|[query]*"], handler.tags = ["ai"], handler.command = /^(elevenlabs)$/i;
export default handler;