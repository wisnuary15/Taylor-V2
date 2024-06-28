const {
  getModels,
  draw,
  generate
} = await await import("../../lib/maker/prodia.js");
const handler = async (m, {
  command,
  usedPrefix,
  conn,
  text,
  args
}) => {
  const input_data = await getModels();
  let [urutan, tema] = text.split("|");
  if (!tema) return m.reply("Input query!\n*Example:*\n.txt2img2 [nomor]|[query]");
  m.react(wait);
  try {
    let data = Object.keys(input_data).map(title => ({
      title: title,
      id: input_data[title]
    }));
    if (!urutan) return m.reply("Input query!\n*Example:*\n.txt2img2 [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    if (isNaN(urutan)) return m.reply("Input query!\n*Example:*\n.txt2img2 [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    if (urutan > data.length) return m.reply("Input query!\n*Example:*\n.txt2img2 [nomor]|[query]\n\n*Pilih angka yg ada*\n" + data.map((item, index) => `*${index + 1}.* ${item.title}`).join("\n"));
    let out = data[urutan - 1].id;
    const params = {
      prompt: encodeURIComponent(tema),
      negative_prompt: "",
      model: out
    };
    const openAIResponse = await generate(params);
    if (openAIResponse) {
      const tag = `@${m.sender.split("@")[0]}`;
      await conn.sendMessage(m.chat, {
        image: openAIResponse[0]?.buffer,
        caption: `Nih effect *${out}* nya\nRequest by: ${tag}`,
        mentions: [m.sender]
      }, {
        quoted: m
      });
    } else {
      console.log("Tidak ada respons dari OpenAI atau terjadi kesalahan.");
    }
  } catch (e) {
    console.error(e);
    m.react(eror);
  }
};
handler.help = ["txt2img2 *[nomor]|[query]*"];
handler.tags = ["ai"];
handler.command = /^(txt2img2)$/i;
export default handler;