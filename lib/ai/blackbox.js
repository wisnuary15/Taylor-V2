import fetch from 'node-fetch';
import {
  FormData,
  Blob
} from 'formdata-node';
import {
  fileTypeFromBuffer
} from 'file-type';
import {
  randomBytes,
  randomUUID
} from "crypto";
class Blackbox {
  constructor() {
    this.userId = randomUUID();
    this.chatId = randomBytes(16).toString("hex")
  }
  async chat(messages, userSystemPrompt = "You are Realtime AI. Follow the user's instructions carefully.",
    webSearchMode = true, playgroundMode = false, codeModelMode = false, isMicMode = false) {
    try {
      const blackboxResponse = await fetch("https://www.blackbox.ai/api/chat", {
        method: "POST",
        mode: "cors",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Referer": "https://www.blackbox.ai/",
          "Content-Type": "application/json",
          "Origin": "https://www.blackbox.ai",
          "DNT": "1",
          "Sec-GPC": "1",
          "Alt-Used": "www.blackbox.ai",
          "Connection": "keep-alive",
        },
        body: JSON.stringify({
          messages,
          id: this.chatId || "chat-free",
          previewToken: null,
          userId: this.userId,
          codeModelMode,
          agentMode: {},
          trendingAgentMode: {},
          isMicMode,
          userSystemPrompt,
          maxTokens: 1024,
          playgroundMode,
          webSearchMode,
          promptUrls: "",
          isChromeExt: false,
          githubToken: null
        })
      });
      return await blackboxResponse.text();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
  async image(imageBuffer, input) {
    try {
      const {
        ext,
        mime
      } = await fileTypeFromBuffer(imageBuffer) || {};
      if (!ext || !mime) return null;
      const form = new FormData();
      const blob = new Blob([imageBuffer], {
        type: mime
      });
      form.append('image', blob, 'image.' + ext);
      form.append('fileName', 'image.' + ext);
      form.append('userId', this.userId);
      const response = await fetch("https://www.blackbox.ai/api/upload", {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      const messages = [{
        role: "user",
        content: data.response + "\n#\n" + input
      }];
      const response2 = await this.chat(messages, "Realtime", true, false, false, false);
      return response2;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}
export {
  Blackbox
};
