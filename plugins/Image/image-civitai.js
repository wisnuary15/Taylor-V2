import fetch from "node-fetch";
const handler = async (m, { conn: conn, isOwner: isOwner, usedPrefix: usedPrefix, command: command, text: text, args: args }) => {
  if (!Number(text)) return m.reply("input number");
  m.react(wait);
  let res = await fetch("https://civitai.com/api/v1/models"),
    jso = await res.json(),
    resu = jso.items[text].modelVersions[0]?.images[0]?.meta.prompt;
  m.reply(resu);
};
handler.help = ["civitai"], handler.tags = ["misc"], handler.command = /^(civitai)$/i;
export default handler;