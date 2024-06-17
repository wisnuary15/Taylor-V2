import fetch from "node-fetch";
const handler = async (m, { conn: conn, usedPrefix: usedPrefix, command: command, args: args }) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || null;
  if (!text) throw "input text\nEx. .vace naruto\n<command> <text>";
  const [one, two, three, four, five, six] = text.split("|");
  if ("vace" === command) {
    const listSections = ["adios", "batmanslap", "carreverse", "changemymind", "distractedbf", "dockofshame", "drip", "ejected", "emergencymeeting", "firsttime", "grave", "heaven", "iamspeed", "icanmilkyou", "npc", "peeposign", "rankcard", "stonks", "tableflip", "water", "wide", "wolverine", "womanyellingatcat"].map(((v, index) => ["                [ RESULT " + (index + 1) + " ]", [
      [v.toUpperCase(), `${usedPrefix}${command}get ${v}|${text}`, ""]
    ]]));
    return conn.sendList(m.chat, "📺 Vace Maker 🔎", `⚡ Silakan pilih Model di tombol di bawah...\n*Teks yang anda kirim:* ${text}\n\nKetik ulang *${usedPrefix + command}* teks anda untuk mengubah teks lagi`, author, "☂️ M O D E L ☂️", listSections, m);
  }
  if ("vaceget" === command) try {
    const res = await Vace(one, two, three, four, five, six);
    await conn.sendFile(m.chat, res, "vace.jpg", "Sudah Jadi", m, !1);
  } catch (error) {
    throw "Gagal membuat Vace.";
  }
};
handler.help = ["vace"].map((v => v + " <text>")), handler.tags = ["maker"],
  handler.command = ["vace", "vaceget"];
export default handler;
const Vace = (efek, teks1, teks2, teks3, teks4) => {
  try {
    return "https://vacefron.nl/api/" + ({
      adios: `adios?user=${teks1}`,
      batmanslap: `batmanslap?text1=${teks1}&text2=${teks2}&batman=${teks3}&robin=${teks4}`,
      carreverse: `carreverse?text=${teks1}`,
      changemymind: `changemymind?text=${teks1}`,
      distractedbf: `distractedbf?boyfriend=${teks1}&girlfriend=${teks2}&woman=${teks3}`,
      dockofshame: `dockofshame?user=${teks1}`,
      drip: `drip?user=${teks1}`,
      ejected: `ejected?name=${teks1}&impostor=BOOL&crewmate=black|blue|brown|cyan|darkgreen|lime|orange|pink|purple|red|white|yellow`,
      emergencymeeting: `emergencymeeting?text=${teks1}`,
      firsttime: `firsttime?user=${teks1}`,
      grave: `grave?user=${teks1}`,
      iamspeed: `iamspeed?user=${teks1}`,
      icanmilkyou: `icanmilkyou?user1=${teks1}[&user2=${teks2}]`,
      heaven: `heaven?user=${teks1}`,
      npc: `npc?text1=${teks1}&text2=${teks2}`,
      peeposign: `peeposign?text=${teks1}`,
      rankcard: `rankcard?username=${teks1}&avatar=${teks2}&currentXp=INT&nextLevelXp=INT&previousLevelXp=INT[&level=INT][&rank=INT][&customBg=${teks3}|HEX][&textShadowColor=HEX][&xpColor=HEX][&circleAvatar=BOOL][&badges=activedeveloper|balance|boost|bravery|brilliance|bughunter|certifiedmoderator|developer|earlysupporter|events|nitro|partner|serverowner|staff]`,
      stonks: `stonks?user=${teks1}[&notStonks=BOOL]`,
      tableflip: `tableflip?user=${teks1}`,
      water: `water?text=${teks1}`,
      wide: `wide?image=${teks1}`,
      wolverine: `wolverine?user=${teks1}`,
      womanyellingatcat: `womanyellingatcat?woman=${teks1}&cat=${teks2}`
    } [efek] || "");
  } catch (error) {
    throw "Error generating URL";
  }
};