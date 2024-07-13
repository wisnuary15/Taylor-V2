import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  let lister = ["v1", "v2"],
    [feature, inputs, inputs_, inputs__, inputs___] = text.split("|");
  if (!lister.includes(feature)) return m.reply("*Example:*\n.anilisthql search|vpn\n\n*Pilih type yg ada*\n" + lister.map((v, index) => "  ○ " + v).join("\n"));
  if (lister.includes(feature)) {
    if ("v1" === feature) {
      if (!inputs) return m.reply("Input query");
      m.react(wait);
      try {
        let teks = (await Anilist("{\n  Page {\n    media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {\n      title {\n        romaji\n        english\n        native\n      }\n      episodes\n      nextAiringEpisode {\n        episode\n        timeUntilAiring\n      }\n      id\n      siteUrl\n      coverImage {\n        large\n        color\n      }\n      studios(isMain: true) {\n        edges {\n          isMain\n          node {\n            name\n            siteUrl\n          }\n        }\n      }\n    }\n  }\n}\n", {
          search: inputs
        })).data.Page.media.map((item, index) => `*[ RESULT ${index + 1} ]*\n\n📚 *Romaji:* ${item.title.romaji || "tidak diketahui"}\n🌐 *English:* ${item.title.english || "tidak diketahui"}\n🌸 *Native:* ${item.title.native || "tidak diketahui"}\n🆔️ *ID:* ${item.id || "tidak diketahui"}\n🔗 *Url:* ${item.siteUrl || "tidak diketahui"}\n🖼️ *Cover:* ${item.coverImage.large || "tidak diketahui"}\n🎨 *Color:* ${item.coverImage.color || "tidak diketahui"}\n🎥 *Studio Name:* ${item.studios.edges[0]?.node.name || "tidak diketahui"}\n🔗 *Site Url:* ${item.studios.edges[0]?.node.siteUrl || "tidak diketahui"}\n`).filter(v => v).join("\n\n________________________\n\n");
        m.reply(teks);
      } catch (e) {
        m.react(eror);
      }
    }
    if ("v2" === feature) {
      if (!inputs) return m.reply("Input query");
      m.react(wait);
      try {
        let teks = [(await Anilist("query ($search: String, $status: MediaStatus) {\n  Media(type: ANIME, status: $status, search: $search) {\n    title {\n      romaji\n      english\n      native\n    }\n    episodes\n    nextAiringEpisode {\n      episode\n      timeUntilAiring\n    }\n    id\n    siteUrl\n    coverImage {\n      large\n      color\n    }\n    studios(isMain: true) {\n      edges {\n        isMain\n        node {\n          name\n          siteUrl\n        }\n      }\n    }\n  }\n}", {
          search: inputs
        })).data.Media].map((item, index) => `*[ RESULT ${index + 1} ]*\n\n📚 *Romaji:* ${item.title.romaji || "tidak diketahui"}\n🌐 *English:* ${item.title.english || "tidak diketahui"}\n🌸 *Native:* ${item.title.native || "tidak diketahui"}\n🆔️ *ID:* ${item.id || "tidak diketahui"}\n🔗 *Url:* ${item.siteUrl || "tidak diketahui"}\n🖼️ *Cover:* ${item.coverImage.large || "tidak diketahui"}\n🎨 *Color:* ${item.coverImage.color || "tidak diketahui"}\n🎥 *Studio Name:* ${item.studios.edges[0]?.node.name || "tidak diketahui"}\n🔗 *Site Url:* ${item.studios.edges[0]?.node.siteUrl || "tidak diketahui"}\n`).filter(v => v).join("\n\n________________________\n\n");
        m.reply(teks);
      } catch (e) {
        m.react(eror);
      }
    }
  }
};
handler.help = ["anilisthql"], handler.tags = ["search"], handler.command = /^(anilisthql)$/i;
export default handler;
async function Anilist(query, variables) {
  return await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then(res => res.json()).catch(err => err);
}
