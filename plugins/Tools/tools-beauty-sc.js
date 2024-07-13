import fs from "fs/promises";
import AdmZip from "adm-zip";
import uglify from "uglify-js";
import beautify from "js-beautify";
const handler = async (m, {
  args,
  command
}) => {
  try {
    const q = m.quoted ? m.quoted : m,
      mime = (q.msg || q).mimetype || "";
    if (!mime || "application/zip" !== mime) throw "Invalid or no media found";
    const media = await q?.download(),
      buffer = Buffer.from(media);
    if (buffer.length / 1048576 > 15) throw "Input file size exceeds 3 MB limit";
    const zip = new AdmZip(buffer),
      obfuscatePromises = [],
      start = new Date(),
      obfuscatedFiles = [],
      errorFiles = [];
    for (const zipEntry of zip.getEntries()) zipEntry.entryName.endsWith(".js") && obfuscatePromises.push((async zipEntry => {
      const jsCode = zipEntry.getData().toString("utf8");
      const uglifyOptions = {
        compress: false,
        mangle: false,
        output: {
          beautify: true,
          comments: false,
          semicolons: true,
          quote_style: 2
        },
        toplevel: true,
        keep_fnames: true
      };
      const beautifyOptions = {
        indent_size: 2,
        indent_level: 0,
        indent_start: 0,
        preserve_newlines: false,
        end_with_newline: true,
        space_in_paren: false,
        space_in_empty_paren: false,
        max_preserve_newlines: 0,
        wrap_line_length: 0,
        wrap_attributes: "auto",
        wrap_attributes_indent_size: 2,
        break_chained_methods: false,
        eol: "\n",
        brace_style: "collapse-preserve-inline"
      };
      try {
        const result = uglify.minify(jsCode, uglifyOptions);
        result.error ? (console.error(`Failed to obfuscate ${zipEntry.entryName}: ${result.error}`), errorFiles.push(zipEntry.entryName)) : (zip.updateFile(zipEntry.entryName, Buffer.from(beautify(result.code, beautifyOptions), "utf8")), obfuscatedFiles.push(zipEntry.entryName));
      } catch (error) {
        console.error(`Failed to obfuscate ${zipEntry.entryName}: ${error.message}`),
          errorFiles.push(zipEntry.entryName);
      }
    })(zipEntry));
    await Promise.all(obfuscatePromises);
    const outputZipPath = Buffer.from(zip.toBuffer()).toString("base64"),
      end = new Date();
    let message = `*Process completed in ${(end - start) / 1e3} seconds.*\n`;
    obfuscatedFiles.length > 0 && (message += `*Beautify files: ${obfuscatedFiles.length}*\n`),
      errorFiles.length > 0 && (message += `*Files encountered errors: ${errorFiles.length}*\n`);
    const fileName = await q.fileName || "ObfuscateZip.zip";
    await conn.sendFile(m.chat, Buffer.from(outputZipPath, "base64"), fileName, fileName, m),
      m.reply(message);
  } catch (err) {
    throw console.error(`Error occurred: ${err.message}`), `Error obfuscating file: ${err.message}`;
  }
};
handler.command = /^(beautysc)$/i;
export default handler;
