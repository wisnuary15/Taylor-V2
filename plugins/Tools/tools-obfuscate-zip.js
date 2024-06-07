import fs from 'fs';
import AdmZip from 'adm-zip';
import JavaScriptObfuscator from 'javascript-obfuscator';
const handler = async (m, {
  args,
  command
}) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || '';
    if (mime !== "application/zip") throw 'Invalid media type. Only "application/zip" is allowed.';
    const buffer = await q?.download();
    const fileSizeInBytes = buffer.length;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    if (fileSizeInMB > 3) throw 'Input file size is too large. It must be below 3 MB.';
    const zip = new AdmZip(buffer);
    const obfuscatePromises = [];
    const start = new Date();
    const obfuscatedFiles = [];
    const errorFiles = [];
    for (const zipEntry of zip.getEntries()) {
      if (zipEntry.entryName.endsWith('.js')) obfuscatePromises.push((async (zipEntry) => {
        const jsCode = zipEntry.getData().toString('utf8');
        try {
          const obfuscatedCode = JavaScriptObfuscator.obfuscate(jsCode, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
            sourceMap: false,
            sourceMapMode: "separate",
          });
          zip.updateFile(zipEntry.entryName, Buffer.from(obfuscatedCode.getObfuscatedCode(), 'utf8'));
          obfuscatedFiles.push(zipEntry.entryName);
        } catch (error) {
          console.error(`Failed to obfuscate ${zipEntry.entryName}: ${error.message}`);
          errorFiles.push(zipEntry.entryName);
        }
      })(zipEntry));
    }
    await Promise.all(obfuscatePromises);
    const outputZipPath = Buffer.from(zip.toBuffer()).toString('base64');
    const end = new Date();
    const processingTime = (end - start) / 1000;
    let message = `*Process completed in ${processingTime} seconds.*\n`;
    if (obfuscatedFiles.length > 0) message += `*Obfuscated files: ${obfuscatedFiles.length}*\n`;
    if (errorFiles.length > 0) message += `*Files encountered errors: ${errorFiles.length}*\n`;
    const fileName = await q.fileName || "ObfuscateZip.zip";
    conn.sendFile(m.chat, Buffer.from(outputZipPath, 'base64'), fileName, fileName, m);
    m.reply(message);
  } catch (err) {
    console.error(`Error occurred: ${err.message}`);
    return m.reply(`An error occurred while obfuscating file: ${err}`);
  }
};
handler.command = /^(obfuszip|obfuscatezip|enczip)$/i;
export default handler;
