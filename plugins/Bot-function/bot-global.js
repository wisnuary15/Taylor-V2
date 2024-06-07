import moment from "moment-timezone";
moment.locale('id');
export async function all(m) {
  try {
    const Sarapan = `📍 ${Sapa()} ${(m?.name || this.getName(m?.sender))} ${Pagi()}`;
    const resizeThumb = pickRandom(["https://api.yimian.xyz/img?size=1800-2400x900-1300",
      "https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2400/1300",
      "https://source.unsplash.com/2400x1300/?wallpapers", thumb, thumbdoc, imagebot
    ]);
    global.Thumbnails = resizeThumb;
    global.botdate = `${htjava} Tanggal: ${moment.tz("Asia/Makassar").format("DD/MM/YYYY")}`;
    global.bottime = `Waktu: ${moment.tz("Asia/Makassar").format("HH:mm:ss")}`;
    global.titlebot =
      `${htjava} Waktu Server: ${moment.tz("Asia/Makassar").format("HH:mm:ss")}\nTanggal Server: ${moment.tz("Asia/Makassar").format("DD/MM/YYYY")}`;
    global.adReplyS = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: false,
          thumbnailUrl: Thumbnails,
          sourceUrl: sgh
        }
      }
    };
    global.adReply = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaType: 1,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: Thumbnails,
          sourceUrl: sgh
        }
      }
    };
    global.fakeig = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaUrl: sig,
          mediaType: 2,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: Thumbnails,
          sourceUrl: sig
        }
      }
    };
    global.fakefb = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaUrl: sfb,
          mediaType: 2,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: Thumbnails,
          sourceUrl: sfb
        }
      }
    };
    global.faketik = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaUrl: snh,
          mediaType: 2,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: Thumbnails,
          sourceUrl: snh
        }
      }
    };
    global.fakeyt = {
      fileLength: SizeDoc(),
      seconds: SizeDoc(),
      contextInfo: {
        mentionedJid: [m?.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: `${wm}`,
          serverMessageId: -1
        },
        businessMessageForwardInfo: {
          businessOwnerJid: businessOwnerJid()
        },
        externalAdReply: {
          title: Sarapan,
          body: author,
          mediaUrl: syt,
          mediaType: 2,
          previewType: 0,
          renderLargerThumbnail: true,
          thumbnailUrl: Thumbnails,
          sourceUrl: syt
        }
      }
    };
    const Org = pickRandom(["0", "628561122343", "6288906250517", "6282195322106", "6281119568305", "6281282722861",
      "6282112790446"
    ]);
    const Parti = pickRandom([`${Org}@s.whatsapp.net`, `${Org}@c.us`]);
    const Remot = pickRandom(["status@broadcast", "120363047752200594@g.us"]);
    const fpayment = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "USD",
          amount1000: SizeDoc(),
          requestFrom: Parti,
          noteMessage: {
            extendedTextMessage: {
              text: Sarapan
            }
          },
          expiryTimestamp: SizeDoc(),
          amount: {
            value: SizeDoc(),
            offset: SizeDoc(),
            currencyCode: "USD"
          }
        }
      }
    };
    const fpoll = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        pollCreationMessage: {
          name: Sarapan
        }
      }
    };
    const fchan = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        newsletterAdminInviteMessage: {
          newsletterJid: '120363204654888455@newsletter',
          newsletterName: author,
          caption: Sarapan
        }
      }
    };
    const ftroli = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        orderMessage: {
          itemCount: SizeDoc(),
          status: 1,
          surface: 1,
          message: bottime,
          orderTitle: Sarapan,
          sellerJid: Parti
        }
      }
    };
    const fkontak = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        contactMessage: {
          displayName: Sarapan,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${Sarapan},;;;\nFN:${Sarapan},\nitem1.TEL;waid=${nomorown.split("@")[0]}:${nomorown.split("@")[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`,
          jpegThumbnail: Buffer.alloc(0),
          thumbnail: Thumbnails,
          sendEphemeral: true
        }
      }
    };
    const fvn = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        audioMessage: {
          mimetype: "audio/ogg; codecs=opus",
          seconds: SizeDoc(),
          ptt: true
        }
      }
    };
    const fvid = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        videoMessage: {
          title: Sarapan,
          h: Sarapan,
          seconds: SizeDoc(),
          caption: Sarapan,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    };
    const ftextt = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        extendedTextMessage: {
          text: Sarapan,
          title: bottime,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    };
    const fliveLoc = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        liveLocationMessage: {
          caption: Sarapan,
          h: bottime,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    };
    const ftoko = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: "image/jpeg",
              jpegThumbnail: Buffer.alloc(0)
            },
            title: Sarapan,
            description: bottime,
            currencyCode: "USD",
            priceAmount1000: SizeDoc(),
            retailerId: "Ghost",
            productImageCount: 1
          },
          businessOwnerJid: Parti
        }
      }
    };
    const fdocs = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        documentMessage: {
          title: Sarapan,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    };
    const fgif = {
      key: {
        participant: Parti,
        remoteJid: Remot
      },
      message: {
        videoMessage: {
          title: Sarapan,
          h: Sarapan,
          seconds: SizeDoc(),
          gifPlayback: true,
          caption: bottime,
          jpegThumbnail: Buffer.alloc(0)
        }
      }
    };
    const Fakes = pickRandom([fdocs, fgif, fkontak, fliveLoc, fpayment, fpoll, fchan, ftextt, ftoko, ftroli, fvid,
      fvn]);
    global.fakes = Fakes;
  } catch (error) {
    console.error("Error:", error);
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function Sapa() {
  const greetings = ["Halo", "Hi", "Hai", "Yo", "Konnichiwa", "Salam", "Namaste", "Annyeonghaseyo", "Assalamualaikum",
    "Bonjour", "Olá", "Marhaba", "Selamat datang", "Good morning", "Konbanwa", "Sugeng enjing", "Halo teman",
    "Hello there", "Konnichiwa minna", "Salam sejahtera"
  ];
  return pickRandom(greetings);
}

function SizeDoc() {
  return Math.pow(10, 15);
}

function Pagi() {
  const waktunya = moment.tz("Asia/Makassar").format("HH");
  return waktunya >= 24 ? "Selamat Begadang 🗿" : waktunya >= 18 ? "Selamat malam 🌙" : waktunya >= 15 ?
    "Selamat sore 🌅" : waktunya > 10 ? "Selamat siang ☀️" : waktunya >= 4 ? "Selamat pagi 🌄" : "Selamat Pagi 🗿";
}

function businessOwnerJid() {
  const Org = pickRandom([nomorown, "0", "628561122343", "6288906250517", "6282195322106", "6281119568305",
    "6281282722861", "6282112790446"
  ]);
  const Parti = pickRandom([`${Org}@s.whatsapp.net`]);
  return Parti;
}
