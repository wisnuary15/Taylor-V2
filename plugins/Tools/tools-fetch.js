import {
  fetch as fetchUndici
} from "undici";
import got from "got";
import fetch from "node-fetch";
import axios from "axios";
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
import {
  FormData
} from "formdata-node";
import _ from "lodash";
const fetchers = [{
  fetcherLib: fetchUndici,
  options: {
    redirect: "follow"
  },
  name: "undici"
}, {
  fetcherLib: got,
  options: {
    followRedirect: true,
    maxRedirects: 5
  },
  name: "got"
}, {
  fetcherLib: fetch,
  options: {
    redirect: "follow"
  },
  name: "node-fetch"
}, {
  fetcherLib: axios,
  options: {
    maxRedirects: 5,
    validateStatus: null
  },
  name: "axios"
}];
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
const parseOptions = inputText => {
  const options = {
    method: "GET",
    headers: {
      ...defaultHeaders
    },
    data: null,
    form: null,
    redirect: "follow",
    cookies: "",
    family: 0
  };
  _.forEach(inputText.split("--").slice(1), opt => {
    const [key, ...values] = opt.trim().split(" ");
    const value = values.join(" ").replace(/(^"|"$)/g, "");
    switch (key) {
      case "method":
        options.method = value.toUpperCase();
        break;
      case "header":
        const [headerKey, headerValue] = value.split(":");
        options.headers[headerKey.trim()] = headerValue.trim();
        break;
      case "data":
        options.data = options.data || {};
        const [dataKey, dataValue] = value.split("=");
        options.data[dataKey.trim()] = dataValue.trim();
        break;
      case "form":
        options.form = options.form || new FormData();
        const [formKey, formValue] = value.split("=");
        options.form.append(formKey.trim(), formValue.trim());
        break;
      case "redirect":
      case "direct":
        options.redirect = "manual";
        break;
      case "cookie":
        options.cookies = value;
        break;
      case "head":
        options.method = "HEAD";
        break;
      case "options":
        options.method = "OPTIONS";
        break;
      case "trace":
        options.method = "TRACE";
        break;
      case "connect":
        options.method = "CONNECT";
        break;
      case "family":
        options.family = parseInt(value, 10);
        break;
      default:
        return options;
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
    const [url, ...optionsText] = inputText.split(" --");
    const options = parseOptions(`--${optionsText.join(" --")}`);
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
      for (const {
          fetcherLib
        }
        of fetchers) {
        try {
          const response = await fetcherLib(link, {
            method: options.method,
            headers: {
              ...options.headers,
              Referer: options.headers.Referer || link,
              Cookie: options.cookies
            },
            body: options.form || ["POST", "PUT", "PATCH"].includes(options.method) ? JSON.stringify(options.data) : null,
            redirect: options.redirect,
            ...options.family ? {
              family: options.family
            } : {}
          });
          const contentType = response.headers.get("content-type");
          const contentDisposition = response.headers.get("content-disposition");
          const contentLength = response.headers.get("content-length");
          const txt = fetcherLib === got ? response.body : fetcherLib === axios ? response.data : await response.text();
          if (!txt.trim()) {
            continue;
          }
          const uniqueId = createHash("sha256").update(link + uniqueIdCounter++).digest("hex");
          resultsMap.set(uniqueId, {
            link: link,
            contentType: contentType,
            contentDisposition: contentDisposition,
            contentLength: contentLength,
            txt: txt
          });
          successCount++;
          break;
        } catch (err) {
          console.error(`⚠️ *Terjadi kesalahan saat mengambil link:* ${link}`, err);
        }
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
    m.reply(`⚠️ *Terjadi kesalahan:* \n${e.message}\nContoh penggunaan:\n*--method GET*\n*--header Content-Type: application/json*\n*--data key=value*\n*--form key=value*\n*--redirect manual*\n*--cookie cookie_data*\n*--family 4*\n*--head*\n*--options*\n*--trace*\n*--connect*`);
    console.error(e);
  }
};
handler.help = ["get", "fetch"];
handler.tags = ["tools"];
handler.alias = ["get", "fetch"];
handler.command = ["get", "fetch"];
export default handler;