import cheerio from 'cheerio';
import axios from 'axios';
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  let lister = ["search", "gif", "vid"]
  let [feature, inputs, inputs_, inputs__, inputs___] = text.split("|")
  if (!lister.includes(feature)) return m.reply("*Example:*\n.pornhub search|vpn\n\n*Pilih type yg ada*\n" + lister
    .map((v, index) => "  ○ " + v).join("\n"))
  if (lister.includes(feature)) {
    if (feature === "search") {
      if (!inputs) return m.reply("Input query")
      try {
        let res = await searchVideo(inputs)
        let teks = res.map((item, index) => {
          return `*[ RESULT ${index + 1} ]*
*Link:* ${item.link}
*Title:* ${item.title}
*Uploader:* ${item.uploader}
*Views:* ${item.views}
*Duration:* ${item.duration}
`
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks)
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "gif") {
      if (!inputs) return m.reply("Input query")
      try {
        let res = await searchGif(inputs)
        let teks = res.map((item, index) => {
          return `*[ RESULT ${index + 1} ]*
*Title:* ${item.title}
*Url:* ${item.url}
*Webm:* ${item.webm}
`
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks)
      } catch (e) {
        m.react(eror)
      }
    }
    if (feature === "vid") {
      if (!inputs) return m.reply("Input query")
      try {
        let res = await getVideo(inputs)
        let teks = res.mediaDefinitions.map((item, index) => {
          return `*[ RESULT ${index + 1} ]*
*format:* ${item.format}
*quality:* ${item.quality}
*videoUrl:* ${item.videoUrl}
`
        }).filter(v => v).join("\n\n________________________\n\n")
        m.reply(teks)
      } catch (e) {
        m.react(eror)
      }
    }
  }
}
handler.help = ["pornhub"]
handler.tags = ["internet"]
handler.command = /^(pornhub)$/i
export default handler
/* New Line */
async function searchVideo(query) {
  const url = `https://www.pornhub.com/video/search?search=${query}`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $('li[data-video-segment]').map((i, el) => {
      const $el = $(el);
      return {
        link: "https://www.pornhub.com" + $el.find('.title a').attr('href').trim(),
        title: $el.find('.title a').text().trim(),
        uploader: $el.find('.videoUploaderBlock a').text().trim(),
        views: $el.find('.views').text().trim(),
        duration: $el.find('.duration').text().trim(),
      };
    }).get();
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}
async function getVideo(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const getSubstring = (startPattern, endPattern) => {
      const startIndex = html.search(startPattern);
      return html.substring(startIndex, html.indexOf(endPattern, startIndex));
    };
    const metaPayload = getSubstring(/var flashvars_\d{1,} = /, ';\n');
    return JSON.parse(metaPayload.substring(metaPayload.indexOf('{')));
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return null;
  }
}
async function searchGif(query) {
  const url = `http://www.pornhub.com/gifs/search?search=${query}`;
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const gifs = $('ul.gifs.gifLink li');
  return gifs.map((i, gif) => {
    const data = $(gif).find('a');
    return {
      title: data.find('span').text(),
      url: 'http://dl.phncdn.com#id#.gif'.replace('#id#', data.attr('href')),
      webm: data.find('video').attr('data-webm'),
    };
  }).get();
}
