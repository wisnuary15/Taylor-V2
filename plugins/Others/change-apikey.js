import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  let one = text.split("|")[1];
  var OpenAi = await getOpenaikey(),
    Lolhum = ["327a6596e4c4baa20c756132", "bukanitucuy14315195", "85faf717d0545d14074659ad", "ed78c137a46873c5b8e5fe3b", "zulfikarbot", "SGWN"],
    Ame = ["1f98ec7e4842d057d7551722f83e9ae5c59896856aa3f96d406ff8fc9185752062920fadf1df1ea71c332d3f6be2dd6fa62b7ac3d0140e40d86ba0e736135820", "bb03f373caa534fcfcbaeae177a65134f44a6e57ba7a7b098be273867b376d8a677ddae3c23c6ded4fec8288573945e8c3483689deb13f229376ad4b5b60231d"],
    logonya = flaaa.getRandom();
  let template = (args[0] || "").toLowerCase(),
    listSections = [],
    caption = `*Contoh Penggunaan*\n\n${usedPrefix + command} list\n\n*List Command*\n• openai\n• lolhuman\n• ame\n`;
  if (!args[0]) return m.reply(caption);
  if (command) switch (template) {
    case "openai":
      if (!one) return Object.keys(OpenAi).map((v, index) => {
        listSections.push(["List. " + ++index, [
          [OpenAi[v].slice(0, 10) + "... ( Use This )", usedPrefix + command + " keyopenai |" + OpenAi[v], ""]
        ]]);
      }), conn.sendList(m.chat, "EDIT APIKEY", args[0]?.toUpperCase(), author, "[ Choose ]", listSections, m);
      break;
    case "keyopenai":
      var openaiinfo = args[0].slice(3).toUpperCase() + " *Berhasil di set*";
      openaikey = one, await conn.sendFile(m.chat, logonya + args[0].slice(3), "qr.png", openaiinfo, m);
      break;
    case "lolhuman":
      if (!one) return Object.keys(Lolhum).map((v, index) => {
        listSections.push(["List. " + ++index, [
          ["Use This", usedPrefix + command + " keylolhuman |" + Lolhum[v], ""]
        ]]);
      }), conn.sendList(m.chat, "EDIT APIKEY", args[0]?.toUpperCase(), author, "[ Choose ]", listSections, m);
      break;
    case "keylolhuman":
      var lolhumaninfo = args[0].slice(3).toUpperCase() + " *Berhasil di set*";
      lolkey = one, await conn.sendFile(m.chat, logonya + args[0].slice(3), "qr.png", lolhumaninfo, m);
      break;
    case "ame":
      if (!one) return Object.keys(Ame).map((v, index) => {
        listSections.push(["List. " + ++index, [
          ["Use This", usedPrefix + command + " keyame |" + Ame[v], ""]
        ]]);
      }), conn.sendList(m.chat, "EDIT APIKEY", args[0]?.toUpperCase(), author, "[ Choose ]", listSections, m);
      break;
    case "keyame":
      var ameinfo = args[0].slice(3).toUpperCase() + " *Berhasil di set*";
      ameapikey = one, await conn.sendFile(m.chat, logonya + args[0].slice(3), "qr.png", ameinfo, m);
  }
};
handler.help = ["changekey"], handler.tags = ["tools"], handler.command = /^(change|(edit|ubah))key$/i;
export default handler;
async function getOpenaikey() {
  try {
    const response = await fetch("https://freeopenai.xyz/api.txt"),
      text = await response.text();
    return text.split(/\s+/);
  } catch (error) {
    return console.error("Terjadi kesalahan:", error), null;
  }
}
