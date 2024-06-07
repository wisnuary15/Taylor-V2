import fetch from "node-fetch"
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m
    .quoted?.description) || null;
  if (!text) return m.reply(
    `Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`
    );
  m.react(wait)
  try {
    const res = await chatWithGPT(text)
    m.reply(res)
  } catch (e) {
    m.react(eror)
  }
}
handler.help = ["fastgpt"]
handler.tags = ["internet", "ai", "gpt"];
handler.command = /^(fastgpt)$/i
export default handler
/* New Line */
async function chatWithGPT(your_qus) {
  function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const _iam = generateRandomString(8);
  const ops = {};
  const response1 = await fetch("https://chat.aidutu.cn/api/cg/chatgpt/user/info?v=1.5", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "referrer": "https://chat.aidutu.cn/",
      "x-iam": _iam,
      "Cookie": `_UHAO={"uid":"160941","school":"","time":1681704243,"ts":"2","name":"chat_q2Ac","head":"\/res\/head\/2ciyuan\/24.jpg","term":"201801","sign":"714653d141dac0e7709f31003b8df858"}; _UIP=0e98d94e599ef74c29fb40cb35971810`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      q: your_qus,
      iam: _iam,
    }),
  });
  const data = await response1.json();
  const xtoken = data.data.token;
  const response2 = await fetch("https://chat.aidutu.cn/api/chat-process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://chat.aidutu.cn/",
      "Cookie": `_UHAO={"uid":"160941","school":"","time":1681704243,"ts":"2","name":"chat_q2Ac","head":"\/res\/head\/2ciyuan\/24.jpg","term":"201801","sign":"714653d141dac0e7709f31003b8df858"}; _UIP=0e98d94e599ef74c29fb40cb35971810`,
      "accept": "application.json, text/plain, */*",
      "x-token": xtoken,
    },
    body: JSON.stringify({
      prompt: your_qus,
      temperature: 0.8,
      top_p: 1,
      options: ops,
      systemMessage: "You are Realtime AI. Follow the user's instructions carefully."
    }),
  });
  const filteredTexts = await response2.text();
  const outs = filteredTexts.split('\n').pop();
  return JSON.parse(outs).text
}
