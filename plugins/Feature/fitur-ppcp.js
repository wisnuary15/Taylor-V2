import { Couples } from "dhn-api";
const handler = async (m, { conn: conn }) => {
  try {
    let { female: female, male: male } = await Couples();
    await conn.sendButtonMessages(m.chat, [
      ["*[ C E W E ]*", author, female, []],
      ["*[ C O W O ]*", author, male, []]
    ], m);
  } catch (error) {
    console.error(error);
  }
};
handler.tags = ["fun"], handler.command = ["ppcp"];
export default handler;