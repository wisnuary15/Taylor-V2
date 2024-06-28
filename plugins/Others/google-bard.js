import {
  fetch
} from "undici";
import uploadImage from "../../lib/uploadImage.js";
import Bardie from "../../lib/ai/bardie.js";
const bard = new Bardie();
import {
  Gemini
} from "../../lib/ai/gemini.js";
const gemini = new Gemini("__Secure-1PSID", "g.a000kAizwbBdNbMHiOjpi3wG6gRWpkyc_b7CpDipldhMCt_UJIpDxrcWnqL7c6jCY-ooclL3NwACgYKAXgSARMSFQHGX2MiZAtXZ3cvSt7VxKSgDFmGzxoVAUF8yKqiRmRoIsjmTMIJrvT-Pm6l0076"),
  handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
  }) => {
    let text;
    if (args.length >= 1) text = args.slice(0).join(" ");
    else {
      if (!m.quoted || !m.quoted?.text) return m.reply("Use *bard (text)* or *bardimg (text/media)*");
      text = m.quoted?.text;
    }
    let q = m.quoted ? m.quoted : m,
      mime = (q.msg || q).mimetype || "";
    if (m.react(wait), mime) {
      if (!mime || "bardimg" !== command) return m.reply("Use *bard (text)* or *bardimg (text/media)*");
      {
        let media = await q?.download(),
          link = (/image\/(png|jpe?g)/.test(mime), await uploadImage(media));
        try {
          let res = await RizzBardImg(text, link);
          m.reply(res.content);
        } catch (e) {
          try {
            let res = await AemtBardImg(text, link);
            m.reply(res);
          } catch (e) {
            m.react(eror);
          }
        }
      }
    } else try {
      let res = await RizzBard(text);
      m.reply(res.content);
    } catch (e) {
      try {
        let res = await AemtBard(text);
        m.reply(res);
      } catch (e) {
        try {
          let res = await GoogleBard(text);
          m.reply(res);
        } catch (e) {
          m.react(eror);
        }
      }
    }
  };
handler.help = ["bard", "bardimg"], handler.tags = ["ai"], handler.command = /^(bard|bardimg)$/i;
export default handler;
async function RizzBard(query) {
  return await bard.question({
    ask: query
  });
}
async function RizzBardImg(query, url) {
  return await bard.questionWithImage({
    ask: query,
    image: url
  });
}
async function AemtBard(query) {
  const bardRes = await fetch(`https://aemt.me/bard?text=${query}`, {
    method: "get",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
  return (await bardRes.json()).result;
}
async function AemtBardImg(query, url) {
  const bardRes = await fetch(`https://aemt.me/bardimg?url=${url}&text=${query}`, {
    method: "get",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
  });
  return (await bardRes.json()).result;
}
async function GoogleBard(query) {
  try {
    return (await gemini.question(query)).content;
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}