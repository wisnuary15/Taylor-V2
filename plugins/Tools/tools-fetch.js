import fetch from "node-fetch";
import {
  format
} from "util";
import userAgent from "fake-useragent";
import {
  sizeFormatter,
  durationFormatter
} from "human-readable";
import {
  createHash
} from "crypto";
import urlRegexSafe from "url-regex-safe";
import {
  delay
} from "@whiskeysockets/baileys";
import _ from "lodash";
const formatSize = sizeFormatter({
  std: "JEDEC",
  decimalPlaces: 2,
  render: (lit, sym) => `${lit} ${sym}B`
});
const formatDuration = durationFormatter({
  allowMultiples: ["d", "h", "m", "s"]
});
const defaultHeaders = {
  "User-Agent": userAgent(),
  Accept: "*/*",
  "Accept-Language": "*/*",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Connection: "keep-alive"
};
const parseOptions = args => {
  const options = {
    method: "GET",
    headers: {
      ...defaultHeaders
    },
    body: null,
    redirect: "follow",
    cookies: "",
    family: 0
  };
  args.forEach(arg => {
    if (arg.startsWith("--post")) {
      options.method = "POST";
      options.body = JSON.parse(arg.split(" ")[1] || "{}");
    } else if (arg.startsWith("--get")) {
      options.method = "GET";
      options.body = JSON.parse(arg.split(" ")[1] || "{}");
    } else if (arg.startsWith("--head")) {
      options.method = "HEAD";
      options.body = null;
    } else if (arg.startsWith("--headers")) {
      options.headers = {
        ...options.headers,
        ...JSON.parse(arg.split(" ")[1] || "{}")
      };
    } else if (arg.startsWith("--redirect")) {
      options.redirect = "manual";
    } else if (arg.startsWith("--cookie")) {
      options.cookies = arg.split(" ")[1];
    } else if (arg.startsWith("--family")) {
      options.family = parseInt(arg.split(" ")[1], 10);
    }
  });
  return options;
};
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  try {
    const inputText = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
    if (!inputText) {
      return m.reply(`⚠️ *Masukkan teks atau balas pesan dengan teks yang ingin diolah.*\nContoh penggunaan:\n*${usedPrefix}${command} <url> [options]*`);
    }
    let [url, ...optionsText] = inputText.split(" --");
    const options = parseOptions(optionsText);
    const [baseUrl, queryParams] = url.split("?");
    const queryParamsObject = queryParams ? Object.fromEntries(new URLSearchParams(queryParams)) : {};
    if (options.method === "GET" && options.body) {
      const queryParamsBody = new URLSearchParams(options.body).toString();
      url = `${baseUrl}?${queryParams ? queryParams + "&" : ""}${queryParamsBody}`;
      options.body = null;
    }
    const totalLinks = _.uniq([...url.matchAll(urlRegexSafe())].map(match => match[0]));
    if (_.isEmpty(totalLinks)) {
      return m.reply("🔍 *Tidak ada link yang ditemukan.*");
    }
    let successCount = 0,
      replyCount = 0,
      mediaCount = 0,
      uniqueIdCounter = 1;
    const resultsMap = new Map();
    for (const link of totalLinks) {
      try {
        const response = await fetch(link, {
          method: options.method,
          headers: {
            ...options.headers,
            Referer: options.headers.Referer || link,
            Cookie: options.cookies
          },
          body: options.method === "POST" ? JSON.stringify(options.body) : null,
          redirect: options.redirect,
          ...options.family ? {
            family: options.family
          } : {}
        });
        if (options.method === "HEAD") {
          const headers = {};
          response.headers.forEach((value, name) => {
            headers[name] = value;
          });
          m.reply(`🔍 *Headers:* \n${JSON.stringify(headers, null, 2)}`);
          continue;
        }
        const contentType = response.headers.get("content-type");
        const contentDisposition = response.headers.get("content-disposition");
        const contentLength = response.headers.get("content-length");
        const txt = await response.text();
        if (!txt.trim()) continue;
        const uniqueId = createHash("sha256").update(link + uniqueIdCounter++).digest("hex");
        resultsMap.set(uniqueId, {
          link: link,
          contentType: contentType,
          contentDisposition: contentDisposition,
          contentLength: contentLength,
          txt: txt
        });
        successCount++;
      } catch (err) {
        console.error(`⚠️ *Terjadi kesalahan saat mengambil link:* ${link}`, err);
      }
    }
    for (const {
        link,
        contentType,
        contentDisposition,
        contentLength,
        txt
      }
      of resultsMap.values()) {
      const finalContentLength = parseInt(contentLength, 10) || txt.length || 0;
      const finalContentType = contentType?.split(";")[0]?.trim() || "";
      const finalContentDisposition = contentDisposition?.match(/filename[^;=\n]*=(["']?)(.*?)\1/)?.[2] || "";
      if (/^(text\/(plain|html|xml)|application\/(json|.*\+xml)|.*\/(javascript|xml|x-www-form-urlencoded))/.test(finalContentType)) {
        if (finalContentLength > 65536) {
          mediaCount++;
          await delay(1024);
          const caption = `🔗 *Link:* ${link}\n📄 *Tipe:* ${finalContentType}\n📊 *Ukuran:* ${formatSize(finalContentLength)}\n*Metode:* \`${options.method}\``;
          await conn.sendFile(m.chat, Buffer.from(txt), finalContentDisposition || finalContentType || "Tidak diketahui", caption, m);
        } else {
          replyCount++;
          await delay(1024);
          let parsedTxt;
          try {
            parsedTxt = format(JSON.parse(txt));
          } catch {
            parsedTxt = txt;
          }
          m.reply(`${parsedTxt.slice(0, 65536)}`);
        }
      } else {
        mediaCount++;
        await delay(1024);
        const caption = `🔗 *Link:* ${link}\n📄 *Tipe:* ${finalContentType}\n📊 *Ukuran:* ${formatSize(finalContentLength)}\n*Metode:* \`${options.method}\``;
        if (finalContentType === "image/gif") {
          await conn.sendMessage(m.chat, {
            document: {
              url: link
            },
            caption: caption,
            mimetype: finalContentType,
            fileName: finalContentDisposition || finalContentType || "Tidak diketahui"
          }, {
            quoted: m
          });
        }
        await conn.sendFile(m.chat, link, finalContentDisposition || finalContentType || "Tidak diketahui", caption, m);
      }
    }
    const elapsedTime = (Date.now() - Date.now()) / 1e3;
    m.reply(`⏱️ *Waktu yang dibutuhkan:* \`${formatDuration(1e3 * elapsedTime)}\`\n✅ *Berhasil diambil:* \`${successCount}\` dari \`${totalLinks.length}\` link.\n- 💬 *Balasan:* \`${replyCount}\`\n- 🎨 *Media:* \`${mediaCount}\`\n*Metode:* \`${options.method}\``);
  } catch (e) {
    m.reply(`⚠️ *Terjadi kesalahan:* \n${e.message}\nContoh penggunaan:\n*--post {data}*\n*--get {data}*\n*--head*\n*--headers {headers}*\n*--redirect manual*\n*--cookie cookie_data*\n*--family 4*`);
    console.error(e);
  }
};
handler.help = ["get", "fetch"];
handler.tags = ["tools"];
handler.alias = ["get", "fetch"];
handler.command = ["get", "fetch"];
export default handler;