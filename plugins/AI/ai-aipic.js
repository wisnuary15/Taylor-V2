import fetch from "node-fetch";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  const text = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  m.react(wait);
  try {
    if (command === "aipic") {
      await conn.sendMessage(m.chat, {
        image: {
          url: `https://sms-bomb.vercel.app/api/aipic.php?prompt=${encodeURIComponent(text)}`
        },
        caption: `*\`Image for:\`*\n- ${text}`
      }, {
        quoted: m
      });
    } else if (command === "aiflux") {
      const data = await flux({
        prompt: text,
        height: 1280,
        width: 720
      });
      if (data.status) {
        data.data.images.forEach(async (image, index) => {
          await conn.sendMessage(m.chat, {
            image: {
              url: image
            },
            caption: `*\`Image ${index + 1}\`*`
          }, {
            quoted: m
          });
        });
      } else {
        m.reply(`Error: ${data.message}`);
      }
    } else if (command === "animagine") {
      await conn.sendMessage(m.chat, {
        image: {
          url: `https://smfahim.onrender.com/animagine?prompt=${encodeURIComponent(text)}`
        },
        caption: `*\`Image for:\`*\n- ${text}`
      }, {
        quoted: m
      });
    } else if (command === "gen") {
      await conn.sendMessage(m.chat, {
        image: {
          url: `https://smfahim.onrender.com/gen?prompt=${encodeURIComponent(text)}`
        },
        caption: `*\`Image for:\`*\n- ${text}`
      }, {
        quoted: m
      });
    } else if (command === "prodia") {
      await conn.sendMessage(m.chat, {
        image: {
          url: `https://smfahim.onrender.com/prodia?prompt=${encodeURIComponent(text)}&model=${Math.floor(Math.random() * 55) + 1}`
        },
        caption: `*\`Image for:\`*\n- ${text}`
      }, {
        quoted: m
      });
    } else if (command === "tensor") {
      await conn.sendMessage(m.chat, {
        image: {
          url: `https://smfahim.onrender.com/tensor?prompt=${encodeURIComponent(text)}`
        },
        caption: `*\`Image for:\`*\n- ${text}`
      }, {
        quoted: m
      });
    }
  } catch (error) {
    console.error(error);
    m.react(eror);
  }
};
handler.help = ["aipic", "aiflux", "animagine", "gen", "prodia", "tensor"];
handler.tags = ["ai"];
handler.command = /^(aipic|aiflux|animagine|gen|prodia|tensor)$/i;
export default handler;

function string(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const headers = {
  authority: "black-forest-labs-flux-1-schnell.hf.space"
};
async function flux(options) {
  try {
    options = {
      prompt: options?.prompt,
      seed: options?.seed || Math.floor(Math.random() * 2147483647) + 1,
      random_seed: options?.random_seed ?? true,
      width: options?.width ?? 512,
      height: options?.height ?? 512,
      steps: options?.steps ?? 8
    };
    if (!options.prompt) return {
      status: false,
      message: "undefined reading prompt!"
    };
    const session_hash = string(11);
    const joinResponse = await fetch("https://black-forest-labs-flux-1-schnell.hf.space/queue/join", {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: [options.prompt, options.seed, options.random_seed, options.width, options.height, options.steps],
        event_data: null,
        fn_index: 2,
        trigger_id: 5,
        session_hash: session_hash
      })
    });
    if (!joinResponse.ok) throw new Error("Failed to join queue");
    const dataResponse = await fetch(`https://black-forest-labs-flux-1-schnell.hf.space/queue/data?session_hash=${session_hash}`, {
      headers: headers
    });
    if (!dataResponse.ok) throw new Error("Failed to retrieve data");
    const rawData = await dataResponse.text();
    const lines = rawData.split("\n");
    const jsonObjects = [];
    lines.forEach(line => {
      if (line.startsWith("data: ")) {
        try {
          const jsonString = line.substring(6).trim();
          const jsonObject = JSON.parse(jsonString);
          jsonObjects.push(jsonObject);
        } catch (error) {
          throw new Error("Failed to parse JSON");
        }
      }
    });
    const result = jsonObjects.find(d => d.msg === "process_completed") || {};
    if (!result?.success) return {
      status: false,
      message: result
    };
    const images = result.output.data.filter(d => typeof d === "object").map(d => d.url);
    return {
      status: true,
      data: {
        images: images
      }
    };
  } catch (e) {
    return {
      status: false,
      message: e.message
    };
  }
}