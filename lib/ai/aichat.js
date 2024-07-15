import fetch from "node-fetch";
import axios from "axios";
import cheerio from "cheerio";
import qs from "qs";
import _ from "lodash";
import {
  v4 as uuid
} from "uuid";
class Aichat {
  constructor() {
    this.url = "https://chat-gpt.org/chat", this.working = !0, this.supports_gpt_35_turbo = !0;
  }
  async createAsync(model, messages, kwargs = {}) {
    const json_data = {
        message: this.formatPrompt(messages),
        temperature: kwargs.temperature || .5,
        presence_penalty: 0,
        top_p: kwargs.top_p || 1,
        frequency_penalty: 0
      },
      response = await fetch("https://chat-gpt.org/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
        },
        body: JSON.stringify(json_data)
      });
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const result = await response.json();
    if (!result.response) throw new Error(`Error Response: ${JSON.stringify(result)}`);
    return result.message;
  }
  formatPrompt(messages) {
    return JSON.stringify(messages);
  }
}
class AI {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://gke-prod-api.useadrenaline.com/",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "x-instance": "adrenaline"
      }
    });
    this.api = axios.create({
      baseURL: "https://search.lepton.run/api/",
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.headersSimSimi = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      Referer: "https://simsimi.vn/"
    };
    this.headersGoody = {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,af;q=0.6",
      "Content-Type": "application/json",
      Origin: "https://www.goody2.ai",
      Referer: "https://www.goody2.ai/chat",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    };
  }
  useadrenaline = async q => {
    try {
      const data = {
        title: q,
        body: "",
        snippets: [],
        is_rush_enabled: false,
        is_public: false,
        files: []
      };
      const {
        data: postResponseData
      } = await this.axiosInstance.post("question", data);
      const {
        data: threadResponseData
      } = await this.axiosInstance.get(`thread/${postResponseData.question_id}?page=1&per_page=10`);
      let jobStatus = "IN_PROGRESS";
      let dataHasil = null;
      while (jobStatus === "IN_PROGRESS") {
        const {
          data: answersResponseData
        } = await this.axiosInstance.get(`question/${threadResponseData.list[0]?.question?.id}/answers`);
        jobStatus = answersResponseData?.[0]?.job_status || "NOT_FOUND";
        dataHasil = answersResponseData?.[0]?.content;
        if (jobStatus === "IN_PROGRESS") {
          console.log("Job is still in progress...");
          await new Promise(resolve => setTimeout(resolve, 1e3));
        }
      }
      return dataHasil;
    } catch (error) {
      console.error("Error fetching useadrenaline data:", error);
      throw error;
    }
  };
  LetmeGpt = async query => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://letmegpt.com/search?q=${encodedQuery}`;
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      return $("#gptans").text() || null;
    } catch (error) {
      console.error("Error fetching LetmeGpt data:", error);
      throw error;
    }
  };
  generateRandomID = length => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return _.sampleSize(characters, length).join("");
  };
  leptonAi = async query => {
    try {
      const rid = this.generateRandomID(10);
      const postData = {
        query: query,
        rid: rid
      };
      const response = await this.api.post("query", postData);
      const llmResponseRegex = /__LLM_RESPONSE__([\s\S]*?)__RELATED_QUESTIONS__/;
      const llmResponseMatch = response.data.match(llmResponseRegex);
      if (llmResponseMatch?.[1]) {
        let llmResponse = llmResponseMatch[1].trim();
        return llmResponse;
      } else {
        throw new Error("No LLM response found.");
      }
    } catch (error) {
      console.error("Error fetching leptonAi response:", error);
      throw new Error("Error fetching LLM response: " + error.message);
    }
  };
  Simsimi = async text => {
    const url = "https://simsimi.vn/web/simtalk";
    try {
      const response = await axios.post(url, `text=${encodeURIComponent(text)}&lc=id`, {
        headers: this.headersSimSimi
      });
      return response.data.success || null;
    } catch (error) {
      console.error("Error asking SimSimi:", error);
      throw error;
    }
  };
  GoodyAI = async q => {
    try {
      const params = {
        message: q,
        debugParams: null
      };
      const response = await axios.post("https://www.goody2.ai/send", params, {
        headers: this.headersGoody,
        responseType: "stream"
      });
      return new Promise((resolve, reject) => {
        let fullText = "";
        response.data.on("data", chunk => {
          const lines = chunk.toString().split("\n");
          for (let line of lines) {
            if (line.startsWith("data: {\"content\":")) {
              try {
                const content = JSON.parse(line.slice(6)).content;
                fullText += content;
              } catch (err) {
                console.error("Error parsing JSON:", err);
              }
            }
          }
        });
        response.data.on("end", () => {
          resolve(fullText);
        });
        response.data.on("error", err => {
          reject(err);
        });
      });
    } catch (error) {
      console.error("Error asking GoodyAI:", error);
      throw error;
    }
  };
  CgtAi = async text => {
    try {
      const conversation_uuid = uuid();
      const requestData = {
        conversation_uuid: conversation_uuid,
        text: text,
        sent_messages: 1
      };
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*",
          "X-Requested-With": "XMLHttpRequest"
        }
      };
      const response = await axios.post("https://www.timospecht.de/wp-json/cgt/v1/chat", qs.stringify(requestData), config);
      return response.data?.data?.message;
    } catch (error) {
      console.error("Error fetching CgtAi data:", error);
      throw new Error("Terjadi kesalahan:", error);
    }
  };
  thinkany = async prompt => {
    try {
      const response = await axios.post("https://thinkany.ai/api/chat", {
        role: "user",
        content: prompt,
        conv_uuid: uuid(),
        mode: "search",
        is_new: true,
        model: "claude-3-haiku"
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching thinkany data:", error);
      throw error;
    }
  };
  degreeguru = async message => {
    try {
      const response = await fetch("https://degreeguru.vercel.app/api/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: message
          }]
        })
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.text();
      return responseData;
    } catch (error) {
      console.error("Error calling Degree Guru API:", error.message);
      throw error;
    }
  };
  ragbot = async message => {
    try {
      const response = await fetch("https://ragbot-starter.vercel.app/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: message
          }],
          useRag: true,
          llm: "gpt-3.5-turbo",
          similarityMetric: "cosine"
        })
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.text();
      return responseData;
    } catch (error) {
      console.error("Error calling Degree Guru API:", error.message);
      throw error;
    }
  };
}
export {
  AI,
  Aichat
};
