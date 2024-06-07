import cheerio from 'cheerio';
import fetch from 'node-fetch';
const handler = async (m, {
  conn,
  isOwner,
  usedPrefix,
  command,
  args
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  m.react(wait)
  try {
    let data = await Bruzu(text, m.name)
    let apiURL = 'https://img.bruzu.com/?' + new URLSearchParams(data).toString();
    conn.sendFile(m.chat, apiURL, "", "*[ Quotes Maker ]*", m)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["bruzu"]
handler.tags = ["search"]
handler.command = /^(bruzu)$/i
export default handler

function getParamsObject(url) {
  const urlParams = new URLSearchParams(url.split('?')[1]);
  const paramsObject = {};
  for (const [key, value] of urlParams.entries()) {
    paramsObject[key] = value;
  }
  return paramsObject;
}

function transformData(data, quotes, watermark) {
  const watermarkText = 'Automate Image production';
  const transformedData = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      let newValue = data[key];
      if (/^[a-z]\.(t|text)$/.test(key)) {
        if (newValue.length < watermarkText.length) {
          newValue = watermark;
        } else {
          newValue = quotes;
        }
      }
      transformedData[key] = newValue;
    }
  }
  return transformedData;
}
async function Bruzu(quotes, watermark) {
  const url = 'https://bruzu.com/templates/';
  const response = await fetch(url);
  const html = await response.text();
  const links = [];
  const $ = cheerio.load(html);
  // Use the specified div class to target the links
  $('div.masonry a').each((index, element) => {
    const link = $(element).attr('href');
    if (link) {
      links.push(link);
    }
  });
  const decodedLinks = links.map(link => decodeURIComponent(link));
  const src = decodedLinks.map(link => getParamsObject(link));
  const json = src[Math.floor(Math.random() * src.length)]
  const transformedData = transformData(json, quotes, watermark);
  return transformedData;
}
