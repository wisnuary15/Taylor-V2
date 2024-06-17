import { sticker } from "../../lib/sticker.js";
import axios from "axios";
import uploadFile from "../../lib/uploadFile.js";
const handler = async (m, { conn: conn, text: text }) => {
  try {
    const q = m.quoted,
      mime = q?.mimetype,
      mediaUrl = mime && ["image", "video", "webp"].includes(mime.split("/")[0]) ? await uploadFile(await (q?.download())) : null,
      senderId = parseInt(m.sender.split("@")[0]),
      senderName = conn.getName(m.sender),
      senderPhotoUrl = await conn.profilePictureUrl(m.sender, "image").catch((() => logo)),
      replyMessage = q ? {
        entities: [],
        avatar: !0,
        id: parseInt(q.sender.split("@")[0]),
        name: conn.getName(q.sender),
        photo: {
          url: await conn.profilePictureUrl(q.sender, "image").catch((() => logo))
        },
        text: q.text || q.caption || q.description || q.message?.documentMessage?.caption || ""
      } : null,
      messageText = text || q?.text || q?.caption || q?.description || q?.message?.documentMessage?.caption || m.text || m.caption || m.message?.documentMessage?.caption || "",
      json = {
        type: "quote",
        format: "png",
        backgroundColor: "#e7ffdd",
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
          entities: [],
          avatar: !0,
          from: {
            id: senderId,
            name: senderName,
            photo: {
              url: senderPhotoUrl
            }
          },
          text: messageText,
          ...replyMessage && {
            replyMessage: replyMessage
          },
          ...mediaUrl && {
            media: {
              url: `https://wsrv.nl/?url=${mediaUrl}&output=png`
            }
          }
        }]
      },
      buffer = await Quotly(json);
    if (!buffer) return m.reply("Error generating quote image.");
    const stickerBuffer = await sticker(buffer, !1, senderName, m.sender.split("@")[0]);
    if (!stickerBuffer) return m.reply("Error creating sticker.");
    await conn.sendFile(m.chat, stickerBuffer, "Quotly.webp", "", m);
  } catch (error) {
    console.error("Handler Error:", error), m.reply("An error occurred while processing your request.");
  }
};
handler.help = ["qc"], handler.tags = ["sticker"], handler.command = /^(qc)$/i;
export default handler;
async function Quotly(data) {
  try {
    const response = await axios.post("https://quote.btch.bz/generate", data, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return Buffer.from(response.data?.result?.image, "base64");
  } catch (e) {
    console.error("Quotly Error:", e);
    try {
      const fallbackResponse = await axios.post("https://quotly.netorare.codes/generate", data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return Buffer.from(fallbackResponse.data?.result?.image, "base64");
    } catch (e) {
      return console.error("Quotly Error (Backup):", e), null;
    }
  }
}