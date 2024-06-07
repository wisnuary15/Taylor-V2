import {
  fetch
} from 'undici';
import cheerio from 'cheerio';
const shuuShuu = async () => {
  try {
    const response = await fetch('https://e-shuushuu.net/random.php');
    const html = await response.text();
    const $ = cheerio.load(html);
    const imageThreads = $('#content .image_thread').get().map((element) => ({
      title: $(element).find('.title a').text().trim(),
      imageLink: 'https://e-shuushuu.net' + $(element).find('.thumb .thumb_image').attr('href'),
      submittedBy: $(element).find('.meta dl dt:contains("Submitted By:") + dd span.reg_user').text().trim(),
      submittedOn: $(element).find('.meta dl dt:contains("Submitted On:") + dd').text().trim(),
      fileSize: $(element).find('.meta dl dt:contains("File size:") + dd').text().trim(),
      dimensions: $(element).find('.meta dl dt:contains("Dimensions:") + dd').text().trim(),
      tags: $(element).find('.meta dl dt:contains("Tags:") + dd span.tag').map((_, tag) => $(tag).text()
      .trim()).get(),
      source: $(element).find('.meta dl dt:contains("Source:") + dd span.tag').text().trim(),
      characters: $(element).find('.meta dl dt:contains("Characters:") + dd span.tag').map((_, character) =>
        $(character).text().trim()).get(),
      oldCharacters: $(element).find('.meta dl dt:contains("Old Characters:") + dd').text().trim().split(',')
        .map(item => item.trim()),
      artist: $(element).find('.meta dl dt:contains("Artist:") + dd span.tag').text().trim()
    }));
    if (imageThreads.length === 0) {
      console.log('No image threads found.');
      return null;
    }
    const randomElement = imageThreads[Math.floor(Math.random() * imageThreads.length)];
    return randomElement;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  m.react(wait)
  try {
    const randomImageData = await shuuShuu();
    if (randomImageData) {
      const formattedOutput = `
✨ *Title:* ${randomImageData.title}
🖼️ *Image Link:* ${randomImageData.imageLink}
👤 *Submitted By:* ${randomImageData.submittedBy}
📅 *Submitted On:* ${randomImageData.submittedOn}
📁 *File Size:* ${randomImageData.fileSize}
📐 *Dimensions:* ${randomImageData.dimensions}
🏷️ *Tags:* ${randomImageData.tags.map(tag => `*"${tag}"*`).join(', ')}
🔗 *Source:* ${randomImageData.source}
👥 *Characters:* ${randomImageData.characters.map(character => `*"${character}"*`).join(', ')}
👴 *Old Characters:* ${randomImageData.oldCharacters.join(', ')}
🎨 *Artist:* ${randomImageData.artist}
            `;
      await conn.sendMessage(m.chat, {
        image: {
          url: randomImageData.imageLink
        },
        caption: formattedOutput,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else {
      console.log('No data available.');
    }
  } catch (error) {
    console.error('Error in example usage:', error);
    m.react(eror);
  }
};
handler.help = ["shuushuu"]
handler.tags = ["ai"]
handler.command = /^(shuushuu)$/i
export default handler
