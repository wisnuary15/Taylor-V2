import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  command,
  usedPrefix
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  try {
    m.reply('Please wait...');
    const res = await FreePik(text);
    if (!res || !res.data) return m.reply('Not found...');
    const randomIndex = Math.floor(Math.random() * res.data.length);
    const randomItem = res.data[randomIndex];
    await conn.sendMessage(m.chat, {
      image: {
        url: randomItem.url
      },
      caption: randomItem.title || randomItem.filename
    }, {
      quoted: m
    });
  } catch (e) {
    throw e;
  }
};
handler.help = ["freepik"];
handler.tags = ["internet"];
handler.command = /^freepik$/i;
export default handler;
/* New Line */
async function FreePik(term) {
  try {
    const freePikUrl = `https://api.freepik.com/v1/resources?locale=id-ID&limit=10&order=latest&term=${term}`;
    const response = await fetch(freePikUrl, {
      headers: {
        "X-Freepik-API-Key": ["FPSX57a44ddb3d984db48bbdefd5965cc978", "FPSX7f2f0ad461c54eeab3e477a4e85443e2"]
          .getRandom()
      }
    });
    const data = await response.json();
    return data;
  } catch (e) {
    throw e;
  }
}
