const isToxic = /(anj[kg]|ajn[gk]|a?njin[gk]|bajingan|b[a]?[n]?gsa?t|ko?nto?l|me?me?[kq]|pe?pe?[kq]|meki|titi[t,d]|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|[kng]e?nto?[t,d]|jembut|bego|dajjal|janc[uo]k|pantek|puki?(mak)?|kimak|kampang|lonte|col[i,mek]|pelacur|henceut|nigga|fuck|dick|bitch|tits|bastard|asshole|a[su,w,yu])/i;
import axios from "axios";
import fetch from "node-fetch";
export async function before(m, {
  isAdmin,
  isBotAdmin
}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  let chat = db.data.chats[m.chat],
    bot = db.data.settings[this.user.jid] || {};
  const isAntiToxic = isToxic.exec(m.text);
  let hapus = m.key.participant,
    bang = m.key.id;
  if (chat.antiToxic && isAntiToxic) {
    var tes = await Analyze(m.text);
    const toxicity = Number(100 * tes.toxicity).toFixed(2);
    let sIndexer;
    sIndexer = toxicity < 15 ? 0 : toxicity > 14 && toxicity < 35 ? 1 : toxicity > 34 && toxicity < 51 ? 2 : toxicity > 50 && toxicity < 76 ? 3 : toxicity > 75 && toxicity < 95 ? 4 : 5;
    if (await this.reply(m.chat, "*Kata Aneh Terdeteksi!* " + (isBotAdmin ? "" : "\n\n_Bot bukan atmin_"), m), isBotAdmin && bot.restrict) return db.data.users[m.sender].warn += 1, db.data.users[m.sender].banned = !0,
      await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: !1,
          id: bang,
          participant: hapus
        }
      });
    if (!bot.restrict) return m.reply("Semoga harimu suram!");
  }
  return !0;
}
async function Analyze(teks) {
  try {
    const result = await axios.post("https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyDh6d2S3S4zOuZSgyySRcnj8uZMNJ6kdFQ", {
      comment: {
        text: teks,
        type: "PLAIN_TEXT"
      },
      languages: ["id"],
      requestedAttributes: {
        SEVERE_TOXICITY: {},
        INSULT: {}
      }
    });
    return {
      toxicity: result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      insult: result.data.attributeScores.INSULT.summaryScore.value,
      combined: (result.data.attributeScores.SEVERE_TOXICITY.summaryScore.value + result.data.attributeScores.INSULT.summaryScore.value) / 2
    };
  } catch (e) {
    return console.error(e), {
      toxicity: NaN,
      insult: NaN,
      combined: NaN
    };
  }
}