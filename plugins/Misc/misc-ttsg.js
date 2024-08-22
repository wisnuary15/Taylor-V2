import fetch from "node-fetch";
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  let res, lang = args[0],
    text = args.slice(1).join(" ");
  2 !== (args[0] || "").length && (lang = "id", text = args.join(" ")), !text && m.quoted?.text && (text = m.quoted?.text);
  try {
    res = await TTSG(text, lang);
  } catch (e) {
    if (m.reply(e + ""), text = args.join(" "), !text) throw `Use example ${usedPrefix + command} en hello world`;
    res = await TTSG(text, "id");
  } finally {
    res && await conn.sendFile(m.chat, res, "audio.mp3", "", m, !0, {
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
    });
  }
};
handler.help = ["ttsg"], handler.tags = ["misc"], handler.command = /^(ttsg)$/i;
export default handler;
async function TTSG(text, lang = "id") {
  return "https://translate.google.com/translate_tts?tl=" + lang + "&q=" + text + "&client=tw-ob";
}