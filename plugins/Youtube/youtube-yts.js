import ytSearch from "yt-search";
const handler = async (m, {
  conn,
  usedPrefix: _p,
  args,
  command
}) => {
  try {
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
      .quoted?.description) || null;
    if (!text) return m.reply(
      `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${_p}${command} Hai, apa kabar?*`
      );
    const {
      all: [bestItem, ...moreItems]
    } = await ytSearch(text);
    const videoItems = moreItems.filter(item => item.type === 'video');
    const formattedData = {
      title: "                *[ Youtube Search ]*\n                 BEST MATCH\n\n",
      rows: [{
        title: "Best",
        highlight_label: "Best match",
        rows: [{
          header: bestItem.title,
          id: `${_p}play ${bestItem.url}`,
          title: bestItem.description,
          description: ""
        }]
      }, {
        title: "More",
        rows: videoItems.map(({
          title,
          url,
          description
        }, index) => ({
          header: `${index + 1}). ${title}`,
          id: `.play ${url}`,
          title: description,
          description: ""
        }))
      }]
    };
    const emojiMap = {
      type: "🎥",
      videoId: "🆔",
      url: "🔗",
      title: "📺",
      description: "📝",
      image: "🖼️",
      thumbnail: "🖼️",
      seconds: "⏱️",
      timestamp: "⏰",
      ago: "⌚",
      views: "👀",
      author: "👤"
    };
    const caption = Object.entries(bestItem).map(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
      const valueToDisplay = key === 'views' ? new Intl.NumberFormat('en', {
          notation: 'compact'
        }).format(value) : key === 'author' ?
        `Name: ${value.name || 'Unknown'}\nURL: ${value.url || 'Unknown'}` : value || 'Unknown';
      return ` ${emojiMap[key] || '🔹'} *${formattedKey}:* ${valueToDisplay}`;
    }).join('\n');
    await conn.sendButtonMessages(m.chat, [
      [formattedData.title + caption, wm, bestItem.image || bestItem.thumbnail || logo, [
          ['Menu List', _p + 'menulist']
        ], null, [
          ['Official Group', sgc]
        ],
        [
          ["Result Here", formattedData.rows]
        ]
      ]
    ], m);
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `An error occurred: ${error}`, m);
  }
};
handler.help = ["yts", "ytsearch"].map(v => "yts" + v + " <search>");
handler.tags = ["tools"];
handler.command = /^y(outubesearch|ts(earch)?)$/i;
export default handler;
