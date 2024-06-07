import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";
const AnimeSound = async (category, page) => {
  try {
    const response = await fetch(`https://audiojungle.net/search/${category}?page=${page}`);
    const html = await response.text();
    const $ = cheerio.load(html);
    return $('source').map((i, elem) => $(elem).attr('src')).get().filter(Boolean);
  } catch (error) {
    console.error('Error fetching sounds:', error);
    return [];
  }
};
const handler = async (m, {
  conn,
  text
}) => {
  if (!text) throw "Input text\ncth: .audiojungle anime.2";
  try {
    m.react(wait);
    let [category, page] = text.split(/[^\w\s]/g);
    let res = await AnimeSound(category, page);
    if (res.length === 0) throw "No audio found";
    let rdm = res[Math.floor(Math.random() * res.length)];
    await conn.sendMessage(m.chat, {
      audio: {
        url: rdm
      },
      seconds: 0,
      ptt: true,
      mimetype: "audio/mpeg",
      fileName: rdm.split("/")[4] + ".mp3",
      waveform: [100, 0, 100, 0, 100, 0, 100]
    }, {
      quoted: m
    });
  } catch (e) {
    console.error('Error:', e);
    throw "Error: Could not retrieve audio.";
  }
};
handler.help = ["audiojungle"];
handler.tags = ["internet"];
handler.command = /^audiojungle$/i;
export default handler;
