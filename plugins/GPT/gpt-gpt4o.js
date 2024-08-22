import fetch from "node-fetch";
const handler = async (m, {
  args,
  usedPrefix,
  command
}) => {
  const text = args.length >= 1 ? args.slice(0).join(" ") : m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  try {
    m.react(wait);
    const providers = [gpt4o, gpt4ov1, gpt4ov2, gpt4ov3];
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
  } catch (error) {
    console.error("Error:", error);
    m.react(eror);
  }
};
handler.help = ["gpt4o"];
handler.tags = ["gpt"];
handler.command = ["gpt4o"];
export default handler;
async function gpt4ov1(prompt) {
  try {
    const response = await fetch(`https://jonellccprojectapis10.adaptable.app/api/gpt4o?context=${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data?.response;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
async function gpt4o(prompt) {
  try {
    const response = await fetch(`https://metoushela-api.vercel.app/gpt4o?context=${encodeURIComponent(prompt)}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data?.response;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}
async function gpt4ov2(prompt) {
  try {
    const response = await fetch("https://mentalwellness-api.onrender.com/api/gpt4o", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [{
          role: "system",
          content: "Anda adalah AI Realtime. Ikuti instruksi pengguna dengan cermat."
        }, {
          role: "user",
          content: prompt
        }]
      })
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Fallback Fetch error:", error);
    return null;
  }
}
async function gpt4ov3(prompt) {
  try {
    const token = Math.random().toString(32).substring(2);
    const d = process.hrtime();
    await fetch("https://thobuiq-gpt-4o.hf.space/run/predict?__theme=light", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://thobuiq-gpt-4o.hf.space",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        data: [{
          text: prompt,
          files: []
        }],
        event_data: null,
        fn_index: 3,
        session_hash: token,
        trigger_id: 18
      })
    });
    await fetch("https://thobuiq-gpt-4o.hf.space/queue/join?__theme=light", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://thobuiq-gpt-4o.hf.space",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      },
      body: JSON.stringify({
        data: [null, null, "idefics2-8b-chatty", "Greedy", .7, 4096, 1, .9],
        event_data: null,
        fn_index: 5,
        session_hash: token,
        trigger_id: 18
      })
    });
    const response = await fetch("https://thobuiq-gpt-4o.hf.space/queue/data?" + new URLSearchParams({
      session_hash: token
    }), {
      headers: {
        Accept: "text/event-stream",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      }
    });
    const reader = response.body.getReader();
    let result = "";
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
      const data = result.split("data: ").pop();
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.msg === "process_completed") {
          const stop = process.hrtime(d);
          const r = parsedData.output.data[0][0][1] || "";
          if (!r) throw new Error("Fail to get response");
          return r;
        }
      }
    }
  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  }
}