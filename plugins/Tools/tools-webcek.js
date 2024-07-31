import fetch from "node-fetch";
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  try {
    if (!args[0]) throw `Contoh: ${usedPrefix + command} nekopoi.care`;
    const message = (await checkWeb(args[0])).map(v => `🌐 *Domain:* ${v.Domain}\n🛡️ *Status:* ${v.Status}`).join("\n\n");
    m.reply(message);
  } catch (error) {
    m.reply(error);
  }
};
handler.command = /^web(check|cek)|(check|cek)web$/i;
export default handler;
async function checkWeb(url) {
  try {
    return (await (await fetch("https://trustpositif.kominfo.go.id/Rest_server/getrecordsname_home", {
      method: "POST",
      body: new URLSearchParams({
        name: url
      })
    })).json())?.values;
  } catch (error) {
    throw "Terjadi kesalahan saat memeriksa status website";
  }
}