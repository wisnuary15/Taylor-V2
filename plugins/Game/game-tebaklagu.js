import fetch from "node-fetch";
let timeout = 12e4,
  poin = Math.random() * 5001 + 5e3 | 0;
const handler = async (m, {
  conn,
  command,
  usedPrefix
}) => {
  ["37i9dQZEVXbObFQZ3JLcXt", "37i9dQZEVXbMDoHDwVN2tF", "37i9dQZF1DXa2EiKmMLhFD", "37i9dQZF1DXdHrK6XFPCM1", "3AaKHE9ZMMEdyRadsg8rcy", "4mFuArYRh3SO8jfffYLSER"].getRandom();
  let imgr = flaaa.getRandom();
  conn.tebaklagu = conn.tebaklagu ? conn.tebaklagu : {};
  let id = m.chat;
  if (id in conn.tebaklagu) return await conn.reply(m.chat, "Masih ada soal belum terjawab di chat ini", conn.tebaklagu[id][0]), !1;
  try {
    let ress = await fetch("https://raw.githubusercontent.com/qisyana/scrape/main/tebaklagu.json"),
      data = await ress.json(),
      json = data[Math.floor(Math.random() * data.length)],
      caption = `*\`🕹️ GAME - ${command.toUpperCase()}\`*

*Soal:*
- Penyanyi nya \`${json.artis}\` sebutkan nama lagu nya.
*Clue:*
- ${"```" + json.judul.replace(/[AIUEOaiueo]/gi, "_") + "```"}

*Hint:* ${usedPrefix}hlag
*Hadiah:* ${poin} XP  
*Waktu:* ${(timeout / 1e3).toFixed(2)} detik

Balas pesan ini untuk menjawab!`;
    conn.tebaklagu[id] = [await conn.reply(m.chat, caption, m, {
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: command.toUpperCase(),
          body: "",
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: imgr + command,
          sourceUrl: ""
        }
      }
    }), json, poin, setTimeout(async () => {
      conn.tebaklagu[id] && await conn.reply(m.chat, `*\`🎮 Timeout GAME - ${command.toUpperCase()}\`*
Jawabannya adalah *${json.judul}*`, conn.tebaklagu[id][0]), delete conn.tebaklagu[id];
    }, timeout)], await conn.sendMessage(m.chat, {
      audio: {
        url: json.lagu
      },
      seconds: fsizedoc,
      ptt: !0,
      mimetype: "audio/mpeg",
      fileName: "vn.mp3",
      waveform: [100, 0, 100, 0, 100, 0, 100]
    }, {
      quoted: m
    });
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["tebaklagu"], handler.tags = ["game"], handler.command = /^tebaklagu/i;
export default handler;
const buttons = [
  ["Hint", "/hlag"],
  ["Nyerah", "menyerah"]
];