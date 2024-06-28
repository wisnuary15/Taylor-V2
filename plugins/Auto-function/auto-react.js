import {
  readFileSync
} from "fs";
const handler = async (m, {
  conn,
  text
}) => {
  conn.sendMessage(m.chat, {
    react: {
      text: emojis,
      key: m.key
    }
  });
};
handler.customPrefix = /^(anjir|((bil|ad)e|dec)k|tytyd|laik|banh|nihh)$/i, handler.command = new RegExp(),
  handler.mods = !1;
export default handler;