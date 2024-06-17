import fetch from "node-fetch";
const handler = async (m, { conn: conn, isOwner: isOwner, usedPrefix: usedPrefix, command: command, args: args }) => {
  let text;
  if (args.length >= 1) text = args.slice(0).join(" ");
  else {
    if (!m.quoted || !m.quoted?.text) throw "input text\nEx. .diffusion hello world\n<command> <tex>";
    text = m.quoted?.text;
  }
  try {
    m.react(wait), await Draw(text).then((async (img) => {
      await conn.sendFile(m.chat, img, text, "*[ Result ]*\n" + text, m);
    }));
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["diffusion"], handler.tags = ["misc"], handler.command = /^(diffusion)$/i;
export default handler;
async function Draw(propmt) {
  const Blobs = await fetch("https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", {
      headers: {
        Authorization: "Bearer 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"
      },
      method: "POST",
      body: JSON.stringify({
        inputs: propmt
      })
    }).then((res => res.blob())),
    arrayBuffer = await Blobs.arrayBuffer();
  return Buffer.from(arrayBuffer);
}