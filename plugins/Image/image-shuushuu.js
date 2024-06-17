import { fetch } from "undici";
import cheerio from "cheerio";
const shuuShuu = async () => {
  try {
    const response = await fetch("https://e-shuushuu.net/random.php"),
      html = await response.text(),
      $ = cheerio.load(html),
      imageThreads = $("#content .image_thread").get().map((element => ({
        title: $(element).find(".title a").text().trim(),
        imageLink: "https://e-shuushuu.net" + $(element).find(".thumb .thumb_image").attr("href"),
        submittedBy: $(element).find('.meta dl dt:contains("Submitted By:") + dd span.reg_user').text().trim(),
        submittedOn: $(element).find('.meta dl dt:contains("Submitted On:") + dd').text().trim(),
        fileSize: $(element).find('.meta dl dt:contains("File size:") + dd').text().trim(),
        dimensions: $(element).find('.meta dl dt:contains("Dimensions:") + dd').text().trim(),
        tags: $(element).find('.meta dl dt:contains("Tags:") + dd span.tag').map(((_, tag) => $(tag).text().trim())).get(),
        source: $(element).find('.meta dl dt:contains("Source:") + dd span.tag').text().trim(),
        characters: $(element).find('.meta dl dt:contains("Characters:") + dd span.tag').map(((_, character) => $(character).text().trim())).get(),
        oldCharacters: $(element).find('.meta dl dt:contains("Old Characters:") + dd').text().trim().split(",").map((item => item.trim())),
        artist: $(element).find('.meta dl dt:contains("Artist:") + dd span.tag').text().trim()
      })));
    if (0 === imageThreads.length) return console.log("No image threads found."), null;
    return imageThreads[Math.floor(Math.random() * imageThreads.length)];
  } catch (error) {
    throw console.error("Error:", error.message), error;
  }
}, handler = async (m, { conn: conn, args: args, usedPrefix: usedPrefix, command: command }) => {
  m.react(wait);
  try {
    const randomImageData = await shuuShuu();
    if (randomImageData) {
      const formattedOutput = `\n✨ *Title:* ${randomImageData.title}\n🖼️ *Image Link:* ${randomImageData.imageLink}\n👤 *Submitted By:* ${randomImageData.submittedBy}\n📅 *Submitted On:* ${randomImageData.submittedOn}\n📁 *File Size:* ${randomImageData.fileSize}\n📐 *Dimensions:* ${randomImageData.dimensions}\n🏷️ *Tags:* ${randomImageData.tags.map((tag => `*"${tag}"*`)).join(", ")}\n🔗 *Source:* ${randomImageData.source}\n👥 *Characters:* ${randomImageData.characters.map((character => `*"${character}"*`)).join(", ")}\n👴 *Old Characters:* ${randomImageData.oldCharacters.join(", ")}\n🎨 *Artist:* ${randomImageData.artist}\n            `;
      await conn.sendMessage(m.chat, {
        image: {
          url: randomImageData.imageLink
        },
        caption: formattedOutput,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else console.log("No data available.");
  } catch (error) {
    console.error("Error in example usage:", error), m.react(eror);
  }
};
handler.help = ["shuushuu"], handler.tags = ["ai"], handler.command = /^(shuushuu)$/i;
export default handler;