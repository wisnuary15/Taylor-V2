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
import {
  fileFromPath
} from "formdata-node/file-from-path";
const fetchers = [{
    lib: fetchUndici,
    options: {
      redirect: "follow"
    }
  }, {
    lib: got,
    options: {
      followRedirect: !0,
      maxRedirects: 5
    }
  }, {
    lib: fetch,
    options: {
      redirect: "follow"
    }
  }, {
    lib: axios,
    options: {
      maxRedirects: 5,
      validateStatus: null
    }
  }],
  formatSize = sizeFormatter({
    std: "JEDEC",
    decimalPlaces: 2,
    render: (lit, sym) => `${lit} ${sym}B`
  }),
  formatDuration = durationFormatter({
    allowMultiples: ["d", "h", "m", "s"]
  }),
  parseOptions = inputText => {
    const options = {
      method: "GET",
      headers: {},
      data: null,
      form: null,
      redirect: "follow",
      cookies: ""
    };
    return inputText.split("--").slice(1).forEach(opt => {
      const [key, ...values] = opt.trim().split(" "), value = values.join(" ").replace(/(^"|"$)/g, "");
      switch (key) {
        case "method":
        case "m":
          options.method = value.toUpperCase();
          break;
        case "header":
        case "h":
          const [headerKey, headerValue] = value.split(":");
          options.headers[headerKey.trim()] = headerValue.trim();
          break;
        case "data":
        case "d":
          options.data = options.data || {};
          const [dataKey, dataValue] = value.split("=");
          options.data[dataKey.trim()] = dataValue.trim();
          break;
        case "form":
        case "f":
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
      }
    }), options;
  },
  handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
  }) => {
    try {
      const inputText = args.join(" ") || m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
      if (!inputText) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} <url> [options]*`);
      const totalLinks = [...new Set([...inputText.matchAll(urlRegexSafe())].map(match => match[0]))];
      if (!totalLinks.length) return m.reply("Tidak ada link yang ditemukan.");
      const options = parseOptions(inputText);
      let successCount = 0,
        replyCount = 0,
        mediaCount = 0,
        uniqueIdCounter = 1;
      const resultsMap = new Map();
      for (const url of totalLinks)
        for (const fetcher of fetchers) try {
          const response = await fetcher.lib(url, {
              method: options.method,
              headers: {
                ...options.headers,
                "User-Agent": userAgent(),
                Cookie: options.cookies,
                Referer: options.headers.Referer || url
              },
              body: options.form || ("POST" === options.method ? JSON.stringify(options.data) : null),
              redirect: options.redirect
            }),
            contentType = response.headers.get("content-type"),
            contentDisposition = response.headers.get("content-disposition"),
            contentLength = response.headers.get("content-length"),
            txt = fetcher.lib === got ? response.body : fetcher.lib === axios ? response.data : await response.text();
          if (!txt || !txt.trim()) {
            m.reply(`Empty result for link: ${url}`);
            continue;
          }
          const uniqueId = createHash("sha256").update(url + uniqueIdCounter++).digest("hex");
          resultsMap.set(uniqueId, {
            url: url,
            contentType: contentType,
            contentDisposition: contentDisposition,
            contentLength: contentLength,
            txt: txt
          }), successCount++;
          break;
        } catch (err) {
          console.error(`Error fetching link: ${url}`, err);
          continue;
        }
      for (const [id, {
          url,
          contentType,
          contentDisposition,
          contentLength,
          txt
        }] of resultsMap) {
        const finalContentLength = parseInt(contentLength, 10) || txt && txt.length || 0,
          finalContentType = contentType && contentType.split(";")[0]?.trim() || "",
          finalContentDisposition = contentDisposition && contentDisposition.match(/filename[^;=\n]*=(["']?)(.*?)\1/)?.[2] || "";
        if (/^(text\/(plain|html|xml)|application\/(json|.*\+xml)|.*\/(javascript|xml|x-www-form-urlencoded))/.test(finalContentType))
          if (finalContentLength > 65536) {
            mediaCount++, await delay(1024);
            const caption = `🔗 *Link:* ${url}\n📄 *Type:* ${finalContentType}\n📊 *Size:* ${formatSize(finalContentLength)}`;
            await conn.sendFile(m.chat, Buffer.from(txt), finalContentDisposition || finalContentType || "Tidak diketahui", caption, m);
          } else {
            let parsedTxt;
            replyCount++, await delay(1024);
            try {
              parsedTxt = format(JSON.parse(txt));
            } catch {
              parsedTxt = txt;
            }
            m.reply(parsedTxt.slice(0, 65536));
          }
        else {
          mediaCount++, await delay(1024);
          const caption = `🔗 *Link:* ${url}\n📄 *Type:* ${finalContentType}\n📊 *Size:* ${formatSize(finalContentLength)}`;
          await conn.sendFile(m.chat, url, finalContentDisposition || finalContentType || "Tidak diketahui", caption, m);
        }
      }
      const elapsedTime = (Date.now() - Date.now()) / 1e3;
      m.reply(`Fetching completed in ${formatDuration(1e3 * elapsedTime)}. Successfully fetched ${successCount} out of ${totalLinks.length} links.\n📝 Replies Sent: ${replyCount}\n📈 Media Sent: ${mediaCount}`);
    } catch (e) {
      throw e;
    }
  };
handler.help = ["get", "fetch"], handler.tags = ["tools"], handler.alias = ["get", "fetch"],
  handler.command = ["get", "fetch"];
export default handler;
