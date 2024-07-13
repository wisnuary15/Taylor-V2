import fetch from "node-fetch";
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  let [tema, urutan, pesan] = text.split(/[^\w\s]/g);
  if (!tema) return m.reply("Input query!\n*Example:*\n.memix [tema]|[angka]|[teks]");
  if (!urutan) return m.reply("Input angka!\n*Example:*\n.memix [tema]|[angka]|[teks]");
  if (isNaN(urutan)) return m.reply("Input angka saja!\n*Example:*\n.memix [tema]|[angka]|[teks]");
  if (!pesan) return m.reply("Input pesan!\n*Example:*\n.memix [tema]|[angka]|[teks]");
  m.react(wait);
  try {
    let data = await getTemplateImageUrl(tema, urutan, pesan);
    /^https:\/\/cdn\.memix\.com/.test(data.url) ? await conn.sendMessage(m.chat, {
      sticker: {
        url: data.url
      },
      thumbnail: await (await conn.getFile(data.url)).data,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: !0,
          mediaType: 1,
          mediaUrl: null,
          title: data.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
          body: m.name,
          sourceUrl: null,
          thumbnail: await (await conn.getFile(data.url)).data
        }
      }
    }, {
      quoted: m
    }) : m.reply("Input query!\n*Example:*\n.memix [tema]|[angka]|[teks]\n\n*Pilih angka yg ada*\n" + data);
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["memix *[tema]|[angka]|[teks]*"], handler.tags = ["internet"],
  handler.command = /^(memix)$/i;
export default handler;
async function getTemplateImageUrl(input, number, text) {
  try {
    const data = await (await fetch("https://api.memix.com/v1/templates/search?q=" + input)).json();
    if (number > data.templates.length) return data.templates.map((item, index) => `*${index + 1}.* ${item.id}`).join("\n");
    {
      const selectedId = data.templates[number - 1].id;
      return {
        url: `https://cdn.memix.com/memix-${selectedId}.webp?text=${encodeURIComponent(text)}`,
        name: selectedId
      };
    }
  } catch (error) {
    return console.error("Error fetching data:", error), "Error fetching data.";
  }
}
