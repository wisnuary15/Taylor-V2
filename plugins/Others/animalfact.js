import fetch from "node-fetch";
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    if (!text) throw `
*${usedPrefix}${command} <nama hewan>*
Contoh:
*${usedPrefix}${command} dog*

Daftar Hewan:
- dog
- cat
- panda
- fox
- red_panda
- koala
- birb
- raccoon
- kangaroo
`.trim();
    let animals = ['dog', 'cat', 'panda', 'fox', 'red_panda', 'koala', 'birb', 'raccoon', 'kangaroo'];
    if (!animals.includes(text)) throw `Nama hewan tidak valid. Silakan gunakan salah satu opsi yang tersedia.`;
    let res = await fetch(API("https://some-random-api.com", "/animal/" + text, {}));
    if (!res.ok) throw `${res.status} ${res.statusText}`;
    let json = await res.json();
    if (json.image) conn.sendFile(m.chat, json.image, "", `${json.fact}`, m);
    else throw json;
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `Terjadi kesalahan dalam memproses perintah.`, m);
  }
};
handler.help = ["animal"].map(v => v + ' <nama_hewan>');
handler.tags = ["internet"];
handler.command = /^(animal|animalfact)$/i;
export default handler;
