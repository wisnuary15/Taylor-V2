const handler = async (m, {
    conn,
    usedPrefix,
    command,
    args,
    isOwner,
    isAdmin,
    isROwner
}) => {
    const features = ["autodlTiktok", "autodlFacebook", "autodlInstagram", "autodlYoutube", "autolevelup", "antibot", "antiFoto", "antiVideo", "antiAudio", "antiCall", "antiDelete", "antiLink", "antiLinkFb", "antiLinkHttp", "antiLinkIg", "antiLinkTel", "antiLinkTik", "antiLinkWa", "antiLinkYt", "antiSatir", "antiSticker", "antiVirtex", "antiToxic", "antibule", "autoBio", "autoChat", "autoAi", "autoGpt", "autochatGpt", "autoJoin", "autoPresence", "autoReply", "autoSticker", "autoVn", "autoGempa", "viewStory", "bcjoin", "detect", "getmsg", "nsfw", "antiSpam", "simi", "alicia", "gptvoice", "characterai", "updateAnime", "updateAnimeNews", "viewonce", "welcome", "autoread", "gconly", "nyimak", "pconly", "self", "antirpg", "swonly", "lastAnime", "latestNews", "wabetainfo"];
    const activeFeatures = ["antiDelete", "detect", "getmsg", "lastAnime", "latestNews", "welcome"];

    const result = features.map((f, i) => {
        let isActive
        if (["self", "pconly", "gconly", "swonly", "antirpg", "autoread", "jadibot", "restrict", "autorestart", "autorestart", "antibot"].includes(f)) {
            isActive = activeFeatures.includes(f) ? !global.db.data.settings[conn.user.jid][f] : global.db.data.settings[conn.user.jid][f];
        } else {
            isActive = activeFeatures.includes(f) ? !global.db.data.chats[m.chat][f] : global.db.data.chats[m.chat][f];
        }
        return `${(i + 1).toString().padEnd(2)}. ${f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).padEnd(18)} ${isActive ? "ON" : "OFF"}`;
    }).join('\n').trimEnd();

    const isEnable = !/false|disable|(turn)?off|0/i.test(command);
    const chat = global.db.data.chats[m.chat];
    const _chat = global.db.data.settings[conn.user.jid];

    const input = args[0];
    const isNumber = !isNaN(input);
    const featureName = isNumber ? features[parseInt(input) - 1] : input;
    const responseText = "```" + `${result}\n` + "```";
    const featureStatus = `*# Feature*            *Mode*\n${"-".repeat(33)}\n${responseText}`;
    const listEnab = `🛠️ *DAFTAR FITUR*\n${featureStatus}\n*📝 CARA MENGGUNAKAN:*\n→ ${usedPrefix + command} [nomor atau nama fitur]`.trimStart();

    if (!features.includes(featureName)) return await conn.reply(m.chat, listEnab, m, adReplyS);

    if (activeFeatures.includes(featureName)) {
        chat[featureName] = !isEnable;
    } else {
        if (["autoChat"].includes(featureName)) {
            conn.autochat = conn.autochat || {};
            conn.autochat.status = isEnable;
        } else if (["self", "pconly", "gconly", "swonly", "antirpg", "autoread", "jadibot", "restrict", "autorestart", "autorestart", "antibot"].includes(featureName)) {
            _chat[featureName] = isEnable;
            global.opts[featureName] = isEnable;
        } else {
            chat[featureName] = isEnable;
        }
    }

    conn.reply(m.chat, `Feature *${featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}* mode *${isEnable ? 'ON' : 'OFF'}*`, m);
}

handler.help = ["en", "dis"].map(v => v + "able <nomor atau nama fitur>");
handler.tags = ["group", "owner"];
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i;

export default handler;