import fetch from "node-fetch";
import * as cheerio from "cheerio";
const handler = async (m, {
  conn,
  command,
  args,
  usedPrefix
}) => {
  try {
    console.log(`Command: ${command}, Args: ${args.join(" ") || "No args"}`);
    const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
    console.log(`Input text: ${inputText}`);
    if (!inputText) {
      console.log("No input text or quoted message provided.");
      return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    }
    m.react("⏳");
    console.log("Reaction sent: ⏳");
    const mediafireResponse = await MediaFire(inputText);
    console.log(`MediaFire response: ${JSON.stringify(mediafireResponse)}`);
    if (!mediafireResponse?.link) {
      console.log("Download link not found in MediaFire response.");
      m.react("❌");
      return m.reply("Link download tidak ditemukan.");
    }
    const infoReply = {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: `MEDIAFIRE`,
          body: `Mengunduh file, harap tunggu...`,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: "https://i.pinimg.com/736x/a2/27/d9/a227d943642d43d8992b1bde1f323dd0.jpg",
          sourceUrl: ""
        }
      }
    };
    console.log("Sending download link...");
    await conn.reply(m.chat, `*\`W A I T\`*`, m, infoReply);
    const captvid = [mediafireResponse.name ? `📺 *Judul:* ${mediafireResponse.name}` : "", mediafireResponse.mime ? `🔗 *MIME:* ${mediafireResponse.mime}` : "", mediafireResponse.filetype ? `📁 *Type:* ${mediafireResponse.filetype}` : "", mediafireResponse.size ? `👁️ *Size:* ${mediafireResponse.size}` : "", mediafireResponse.uploaded ? `📆 *Uploaded:* ${mediafireResponse.uploaded}` : ""].filter(Boolean).join("\n");
    console.log(`File info:\n${captvid}`);
    await conn.sendFile(m.chat, mediafireResponse.link, mediafireResponse.name || "file", captvid, m, null, {
      mimetype: mediafireResponse.mime || "application/octet-stream",
      asDocument: true
    });
    m.react("✅");
    console.log(`File sent successfully: ${mediafireResponse.link}`);
  } catch (error) {
    console.error("Handler Error:", error);
    m.react("❌");
    m.reply("Terjadi kesalahan saat memproses permintaan.");
  }
};
handler.help = ["mediafire"];
handler.tags = ["downloader"];
handler.command = /^m(ediafire(d(own(load(er)?)?|l))?|f(d(own(load(er)?)?|l))?)$/i;
handler.limit = true;
export default handler;
async function MediaFire(url) {
  try {
    const data = await fetch(`https://www-mediafire-com.translate.goog/${url.replace("https://www.mediafire.com/", "")}?_x_tr_sl=en&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp`).then(res => res.text());
    const $ = cheerio.load(data);
    const downloadUrl = ($("#downloadButton").attr("href") || "").trim();
    const alternativeUrl = ($("#download_link > a.retry").attr("href") || "").trim();
    const $intro = $("div.dl-info > div.intro");
    const filename = $intro.find("div.filename").text().trim();
    const filetype = $intro.find("div.filetype > span").eq(0).text().trim();
    const ext = /\(\.(.*?)\)/.exec($intro.find("div.filetype > span").eq(1).text())?.[1]?.trim() || "bin";
    const uploaded = $("div.dl-info > ul.details > li").eq(1).find("span").text().trim();
    const filesize = $("div.dl-info > ul.details > li").eq(0).find("span").text().trim();
    return {
      link: downloadUrl || alternativeUrl,
      alternativeUrl: alternativeUrl,
      name: filename,
      filetype: filetype,
      mime: ext,
      uploaded: uploaded,
      size: filesize
    };
  } catch (error) {
    console.error(error);
  }
}