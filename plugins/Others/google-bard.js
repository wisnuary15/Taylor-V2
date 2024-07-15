import {
  fetch
} from "undici";
import uploadImage from "../../lib/uploadImage.js";
import Bardie from "../../lib/ai/bardie.js";
const bard = new Bardie();
import {
  dekuai
} from "../../lib/ai/ai-dekuai.js";
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
    let q = m.quoted ? m.quoted : m,
      mime = (q.msg || q).mimetype || "";
    if (args.length >= 1) text = args.slice(0).join(" ");
    else {
      if (!q || !q?.text) return m.reply("Use *bard (text)* or *bardimg (text/media)*");
      text = q?.text;
    }
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
            let res = await joshweb_img(text, link);
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
        let res = await joshweb(text);
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
async function joshweb(query) {
  return (await dekuai.api("new/gemini", {
    prompt: query
  }))?.result.data;
}
async function joshweb_img(query, url) {
  return (await dekuai.api("gemini", {
    prompt: query,
    url: url
  }))?.gemini;
}
async function GoogleBard(query) {
  try {
    return (await gemini.question(query)).content;
  } catch (error) {
    throw console.error("An error occurred:", error.message), error;
  }
}
