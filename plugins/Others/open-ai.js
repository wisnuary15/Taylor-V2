import fetch from "node-fetch";
import https from "https";
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
    return m.reply(`Input query text!\n*Example:*\n- *${usedPrefix + command}* hello`);
  }
  const providers = [ChatGptOrgUk, BlackboxAI, AryaGpt, GoodyApi, RnsChat, Widipe, Andrie, RapidGpt, CleanDx];
  try {
    const encodedText = encodeURIComponent(text);
    let result = null;
    for (const provider of providers) {
      try {
        result = await provider(encodedText);
        if (result) break;
      } catch (error) {
        console.error(`Error in provider ${provider.name}:`, error);
      }
    }
    if (!result) return m.reply("No result");
    m.reply(result);
  } catch (error) {
    console.error("Error:", error);
    m.reply("An error occurred while processing your request.");
  }
};
handler.help = ["ai"];
handler.tags = ["ai", "gpt"];
handler.command = /^(ai)$/i;
export default handler;

function baseHeaders(url) {
  return {
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
  };
}
let randomID = () => [...Array(7)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" [Math.floor(Math.random() * 36)]).join("");
let randomUserID = Math.random().toString(16).substring(2, 8) + "-" + Math.random().toString(16).substring(2, 4) + "-" + Math.random().toString(16).substring(2, 4) + "-" + Math.random().toString(16).substring(2, 4) + "-" + Math.random().toString(16).substring(2, 12);
const BlackboxAI = async query => {
  const body = {
    messages: [{
      role: "user",
      content: query
    }],
    id: randomID(),
    previewToken: null,
    userId: randomUserID,
    codeModelMode: true,
    agentMode: {},
    trendingAgentMode: {},
    isMicMode: false,
    isChromeExt: false,
    githubToken: null,
    clickedAnswer2: false,
    clickedAnswer3: false,
    clickedForceWebSearch: false,
    visitFromDelta: null
  };
  let url = "http://www.blackbox.ai/api/chat";
  try {
    const response = await fetch(url, {
      headers: baseHeaders("https://www.blackbox.ai/api/chat"),
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
      credentials: "omit"
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawText = await response.text();
    let lastIndex = rawText.lastIndexOf("$");
    let cleanedText = rawText.slice(lastIndex + 1);
    return cleanedText;
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
const Andrie = async query => {
  try {
    const response = await fetch("https://andrie.vercel.app/api/gpt?query=" + query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
const AryaGpt = async query => {
  try {
    const apiClient = new Arya();
    const response = await apiClient.chatGPT(null, query, query, null);
    if (response.code !== 200) throw new Error("Network response was not ok");
    const data = response.gpt;
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};