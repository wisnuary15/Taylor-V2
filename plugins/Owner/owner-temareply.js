import moment from "moment-timezone";
const handler = async (m, {
  conn,
  command,
  text
}) => {
  conn.temareply = conn.temareply || {
    contextInfo: {}
  };
  let themes = {
    1: 'Normal',
    2: 'AdReply Small',
    3: 'AdReply Large',
    4: 'Newsletter',
    5: 'Newsletter with AdReply Small',
    6: 'Newsletter with AdReply Large'
  };
  let themeDetails = {
    'Normal': {
      contextInfo: {}
    },
    'AdReply Small': {
      contextInfo: {
        externalAdReply: {
          title: ucapan() + " " + m.name,
          thumbnail: await (await conn.resize(pickRandom([logo, imagebot]), 300, 250))
        },
      },
    },
    'AdReply Large': {
      contextInfo: {
        externalAdReply: {
          title: ucapan() + " " + m.name,
          body: bottime,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: pickRandom([logo, imagebot]),
          sourceUrl: ''
        }
      },
    },
    'Newsletter': {
      contextInfo: {
        groupMentions: [],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363144038483540@newsletter',
          newsletterName: author,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        forwardingScore: 256
      }
    },
    'Newsletter with AdReply Small': {
      contextInfo: {
        groupMentions: [],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363144038483540@newsletter',
          newsletterName: author,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        forwardingScore: 256,
        externalAdReply: {
          title: ucapan() + " " + m.name,
          thumbnail: await (await conn.resize(pickRandom([logo, imagebot]), 300, 250))
        }
      }
    },
    'Newsletter with AdReply Large': {
      contextInfo: {
        groupMentions: [],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363144038483540@newsletter',
          newsletterName: author,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        forwardingScore: 256,
        externalAdReply: {
          title: ucapan() + " " + m.name,
          body: bottime,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: pickRandom([logo, imagebot]),
          sourceUrl: ''
        }
      }
    }
  };
  if (text) {
    let themeIndex = parseInt(text);
    if (isNaN(themeIndex) || !themes[themeIndex]) {
      conn.reply(m.chat, 'Input tidak valid. Silakan pilih tema dari daftar berikut:\n' + Object.entries(themes)
        .map(([id, theme]) => `*${id}.* ${theme}`).join('\n'), m);
      return;
    }
    const themeKey = themes[themeIndex];
    const themeDetail = themeDetails[themeKey];
    conn.temareply = themeDetail;
    conn.reply(m.chat, 'Tema berhasil diatur\n' + themeIndex + '. ' + themeKey, m);
  } else {
    conn.reply(m.chat, 'Input tidak valid. Silakan pilih tema dari daftar berikut:\n' + Object.entries(themes).map((
      [id, theme]) => `*${id}.* ${theme}`).join('\n'), m);
    return;
  }
};
handler.help = ['temareply']
handler.tags = ['owner']
handler.command = /^(temareply)$/i
handler.owner = true
export default handler;

function pickRandom(list) {
  const shuffledList = list.slice().sort(() => Math.random() - 0.5);
  return shuffledList[Math.floor(Math.random() * shuffledList.length)];
}

function businessOwnerJid() {
  return pickRandom([nomorown, "0", "628561122343", "6288906250517", "6282195322106", "6281119568305", "6281282722861",
    "6282112790446"
  ]) + "@s.whatsapp.net";
}

function ucapan() {
  let waktunya = moment.tz("Asia/Makassar").format("HH");
  return waktunya >= 24 ? "Selamat Begadang 🗿" : waktunya >= 18 ? "Selamat malam 🌙" : waktunya >= 15 ?
    "Selamat sore 🌅" : waktunya > 10 ? "Selamat siang ☀️" : waktunya >= 4 ? "Selamat pagi 🌄" : "Selamat Pagi 🗿";
}
