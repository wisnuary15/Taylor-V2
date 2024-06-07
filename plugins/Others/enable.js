const handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  const features = ["autodlTiktok", "autodlFacebook", "autodlInstagram", "autodlYoutube", "autolevelup", "antibot",
    "antiFoto", "antiVideo", "antiAudio", "antiCall", "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp",
    "antiLinkIg", "antiLinkTel", "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker",
    "antiVirtex", "antiToxic", "antibule", "autoBio", "autoChat", "autoAi", "autoGpt", "autochatGpt", "autoJoin",
    "autoPresence", "autoReply", "autoSticker", "autoVn", "autoGempa", "viewStory", "bcjoin", "detect", "getmsg",
    "nsfw", "antiSpam", "simi", "alicia", "gptvoice", "characterai", "updateAnime", "updateAnimeNews", "viewonce",
    "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "antirpg", "swonly", "lastAnime", "latestNews",
    "wabetainfo"
  ];
  const activeFeatures = ["detect", "getmsg", "lastAnime", "latestNews", "welcome", "antiSpam"];
  const sections = features.map((f, i) => {
    const isActive = (["self", "pconly", "gconly", "swonly", "antirpg", "autoread", "jadibot", "restrict",
      "autorestart", "autorestart", "antibot"
    ].includes(f)) ? activeFeatures.includes(f) ? !db.data.settings[conn.user.jid][f] : db.data.settings[conn
      .user.jid][f] : activeFeatures.includes(f) ? !db.data.chats[m.chat][f] : db.data.chats[m.chat][f];
    const status = isActive ? "ON" : "OFF";
    const header =
      `${(i + 1).toString().padEnd(2)}. ${f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).padEnd(18)}`;
    const id = `${usedPrefix + command} ${i + 1}`;
    const description = isActive ? "Switch OFF" : "Switch ON";
    const row = {
      header,
      id,
      title: "",
      description
    };
    const highlight_label = status;
    const rows = [{
      ...row,
      highlight_label
    }];
    return {
      title: `${htki} ${i + 1} ${htka}`,
      highlight_label: "Mode " + highlight_label.trim(),
      rows
    };
  });
  const isEnable = !/false|disable|(turn)?off|0/i.test(command);
  const input = args[0];
  const isNumber = !isNaN(input);
  const featureName = isNumber ? features[parseInt(input) - 1] : input;
  const totalOn = Object.values(db.data.chats[m.chat]).filter(val => val === true).length;
  const totalOff = Object.values(db.data.chats[m.chat]).filter(val => val === false).length;
  const featureStatus = `- Features: *${features.length}*\n- Total ON: *${totalOn}*\n- Total OFF: *${totalOff}*`;
  const listEnab =
    `🛠️ *DAFTAR FITUR*\n${featureStatus}\n*📝 CARA MENGGUNAKAN:*\n→ ${usedPrefix + command} [nomor atau nama fitur]`
    .trimStart();
  if (!features.includes(featureName)) return sections.length ? await conn.sendButtonMessages(m.chat, [
    [listEnab, wm, logo, [], null, [],
      [
        ["Open Here", sections]
      ], m
    ]
  ], {
    contextInfo: {
      mentionedJid: conn.parseMention(m.text)
    }
  }) : conn.reply(m.chat, `Daftar fitur kosong`, m);
  if (activeFeatures.includes(featureName)) {
    db.data.chats[m.chat][featureName] = isEnable;
  } else {
    if (["autoChat"].includes(featureName)) {
      conn.autochat = conn.autochat || {};
      conn.autochat.status = isEnable;
    } else if (["self", "pconly", "gconly", "swonly", "antirpg", "autoread", "jadibot", "restrict", "autorestart",
        "autorestart", "antibot"
      ].includes(featureName)) {
      db.data.settings[conn.user.jid][featureName] = isEnable;
      opts[featureName] = isEnable;
    } else {
      db.data.chats[m.chat][featureName] = isEnable;
    }
  }
  conn.reply(m.chat,
    `Feature *${featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}* mode *${isEnable ? 'ON' : 'OFF'}*`,
    m);
}
handler.help = ["en", "dis"].map(v => v + "able <nomor atau nama fitur>");
handler.tags = ["group", "owner"];
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i;
handler.admin = true;
export default handler;
