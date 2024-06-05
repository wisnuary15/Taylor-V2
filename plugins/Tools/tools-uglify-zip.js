import fs from 'fs/promises';
import AdmZip from 'adm-zip';
import uglify from 'uglify-js';
const handler = async (m, {
    args,
    command
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        if (!mime || mime !== "application/zip") throw 'Invalid or no media found';
        const media = await q?.download();
        const buffer = Buffer.from(media);
        const fileSizeInMB = buffer.length / (1024 * 1024);
        if (fileSizeInMB > 3) throw 'Input file size exceeds 3 MB limit';
        const zip = new AdmZip(buffer);
        const obfuscatePromises = [];
        const start = new Date();
        const obfuscatedFiles = [];
        const errorFiles = [];
        for (const zipEntry of zip.getEntries()) {
            if (zipEntry.entryName.endsWith('.js')) {
                obfuscatePromises.push((async (zipEntry) => {
                    const jsCode = zipEntry.getData().toString('utf8');
                    try {
                        const result = uglify.minify(jsCode, {
                            mangle: {
                                toplevel: true
                            },
                            compress: {
                                toplevel: true
                            }
                        });
                        if (result.error) {
                            console.error(`Failed to obfuscate ${zipEntry.entryName}: ${result.error}`);
                            errorFiles.push(zipEntry.entryName);
                        } else {
                            zip.updateFile(zipEntry.entryName, Buffer.from(result.code, 'utf8'));
                            obfuscatedFiles.push(zipEntry.entryName);
                        }
                    } catch (error) {
                        console.error(`Failed to obfuscate ${zipEntry.entryName}: ${error.message}`);
                        errorFiles.push(zipEntry.entryName);
                    }
                })(zipEntry));
            }
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
        throw `Error obfuscating file: ${err.message}`;
    }
};
handler.command = /^(uglifyzip)$/i;
export default handler;
