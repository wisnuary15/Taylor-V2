import fetch from "node-fetch";
import {
  Arya
} from "../../lib/ai/arya-hcr.js";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) {
    return m.reply(`Masukkan teks atau balas pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  const providers = [gipiti4, Llm, ChatGptOrgUk, BlackboxAI, GoodyApi, RnsChat, Widipe, Andrie, AryaGpt, AryaGptV2, RapidGpt, CleanDx];
  let resultFound = false;
  for (const service of providers) {
    try {
      const res = await service(text);
      if (res) {
        m.reply(res);
        resultFound = true;
        break;
      }
    } catch (e) {
      return null;
      console.log(e);
    }
  }
  if (!resultFound) {
    m.react(eror);
    m.reply("Tidak ada provider yang memberikan hasil.");
  }
};
handler.help = ["ai"];
handler.tags = ["ai", "gpt"];
handler.command = /^(ai)$/i;
export default handler;
const baseHeaders = url => ({
  accept: "application/json, text/event-stream",
  "accept-language": "ru,en;q=0.9",
  "content-type": "application/json",
  priority: "u=1, i",
  "sec-ch-ua": '"Chromium";v="124", "YaBrowser";v="24.6", "Not-A.Brand";v="99", "Yowser";v="2.5"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  plugins: "0",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-requested-with": "XMLHttpRequest",
  Referer: url,
  "Referrer-Policy": "strict-origin-when-cross-origin"
});
const BlackboxAI = async query => {
  try {
    const response = await fetch("https://www.blackbox.ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{
          id: null,
          content: query,
          role: "user"
        }],
        id: null,
        previewToken: null,
        userId: null,
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        isChromeExt: false,
        githubToken: null
      })
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const rawText = await response.text();
    return rawText.slice(rawText.lastIndexOf("$") + 1);
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const ChatGptOrgUk = async query => {
  try {
    const response = await fetch("https://chat.chatgpt.org.uk/api/openai/v1/chat/completions", {
      headers: baseHeaders("https://chat.chatgpt.org.uk/api/openai/v1/chat/completions"),
      body: JSON.stringify({
        messages: [{
          role: "user",
          content: query
        }],
        stream: false,
        model: "gpt-3.5-turbo",
        temperature: .5,
        presence_penalty: 0,
        frequency_penalty: 0,
        top_p: 1
      }),
      method: "POST"
    });
    const text = await response.json();
    return text.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const CleanDx = async query => {
  const Baseurl = "https://vipcleandx.xyz/";
  const linkaiList = [{
    content: query,
    role: "user",
    nickname: "",
    time: Date.now(),
    isMe: true
  }, {
    content: "Saya AI dari OpenAI, diciptakan untuk membantu Anda mengeksplorasi ide, bertukar informasi, dan menyelesaikan masalah. Ada yang bisa saya bantu?",
    role: "assistant",
    nickname: "AI",
    time: Date.now(),
    isMe: false
  }];
  if (linkaiList.length > 10) linkaiList.shift();
  try {
    const response = await fetch(`${Baseurl}v1/chat/gpt/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": Array.from({
          length: 4
        }, () => Math.floor(256 * Math.random())).join("."),
        Referer: Baseurl,
        Accept: "application/json, text/plain, */*"
      },
      body: JSON.stringify({
        list: linkaiList,
        id: Math.floor(256 * Math.random()),
        title: query,
        prompt: "",
        temperature: .7,
        models: 0,
        continuous: true,
        is_web: true
      })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.text();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const Widipe = async query => {
  try {
    const response = await fetch(`https://widipe.com/openai?text=${query}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const Andrie = async query => {
  try {
    const response = await fetch(`https://andrie.vercel.app/api/gpt?query=${query}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const Llm = async query => {
  try {
    const response = await fetch(`https://llm-chat.vercel.app/api?text=${query}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const gipiti4 = async content => {
  try {
    const response = await fetch("https://chatbot-gpt4.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: {
          id: "gpt-4",
          name: "GPT-4",
          maxLength: 24e3,
          tokenLimit: 8e3
        },
        messages: [{
          role: "user",
          content: content
        }],
        temperature: .7,
        top_p: .9,
        top_k: 60
      })
    });
    const data = await response.text();
    if (data === "Error") console.log("internal server error!");
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const RnsChat = async query => {
  try {
    const response = await fetch("https://api.rnilaweera.lk/api/v1/user/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer rsnai_C5Y6ZSoUt3LRAWopF6PQ2Uef"
      },
      body: JSON.stringify({
        prompt: query
      })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const RapidGpt = async query => {
  try {
    const response = await fetch("https://chatgpt-42.p.rapidapi.com/conversationgpt4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": "ec4a07939fmsh4daed89d45e8bccp165f71jsn06c493b781a9",
        "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com"
      },
      body: JSON.stringify({
        messages: [{
          role: "user",
          content: query
        }],
        system_prompt: "I am GPT-4 Turbo, a large language model created by OpenAI.",
        temperature: .1,
        top_k: 5,
        top_p: .9,
        max_tokens: 256,
        web_access: false
      })
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const GoodyApi = async query => {
  const url = "https://www.goody2.ai/send";
  const headers = {
    authority: "www.goody2.ai",
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "text/plain",
    origin: "https://www.goody2.ai",
    referer: "https://www.goody2.ai/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  };
  const body = JSON.stringify({
    message: query
  });
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const AryaGpt = async query => {
  try {
    const response = new Arya();
    const data = await response.chatGPT(null, query);
    return data.gpt;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const AryaGptV2 = async query => {
  try {
    const response = new Arya();
    const data = await response.chatComplements(null, query);
    return data.message;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};