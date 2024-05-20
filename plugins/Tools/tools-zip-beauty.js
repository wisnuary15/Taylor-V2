import fs from 'fs/promises';
import AdmZip from 'adm-zip';
import jsbeautify from 'js-beautify';

const {
    js_beautify,
    css_beautify,
    html_beautify
} = jsbeautify;

const handler = async (m, {
    args,
    command
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = (q.msg || q).mimetype || '';
        const media = await q.download();

        if (!mime || mime !== "application/zip") throw 'Invalid or no media found';

        const buffer = Buffer.from(media);
        const fileSizeInMB = buffer.length / (1024 * 1024);

        if (fileSizeInMB > 3) throw 'Input file size exceeds 3 MB limit';

        const zip = new AdmZip(buffer);
        const beautifyPromises = [];
        const start = new Date();

        const beautifiedFiles = [];
        const errorFiles = [];

        for (const zipEntry of zip.getEntries()) {
            if (zipEntry.entryName.endsWith('.js')) {
                beautifyPromises.push((async (zipEntry) => {
                    const jsCode = zipEntry.getData().toString('utf8');
                    try {
                        let result;
                        if (command === 'beautyjszip') result = js_beautify(jsCode);
                        if (command === 'beautycsszip') result = css_beautify(jsCode);
                        if (command === 'beautyhtmlzip') result = html_beautify(jsCode);

                        zip.updateFile(zipEntry.entryName, Buffer.from(result, 'utf8'));
                        beautifiedFiles.push(zipEntry.entryName);
                    } catch (error) {
                        console.error(`Failed to beautify ${zipEntry.entryName}: ${error.message}`);
                        errorFiles.push(zipEntry.entryName);
                    }
                })(zipEntry));
            }
        }

        await Promise.all(beautifyPromises);
        const outputZipPath = Buffer.from(zip.toBuffer()).toString('base64');
        const end = new Date();
        const processingTime = (end - start) / 1000;

        let message = `*Process completed in ${processingTime} seconds.*\n`;

        if (beautifiedFiles.length > 0) message += `*Beautified files: ${beautifiedFiles.length}*\n`;

        if (errorFiles.length > 0) message += `*Files encountered errors: ${errorFiles.length}*\n`;

        const fileName = await q.fileName || "BeautifiedZip.zip";
        await conn.sendFile(m.chat, Buffer.from(outputZipPath, 'base64'), fileName, fileName, m);
        await m.reply(message);
    } catch (err) {
        console.error(`Error occurred: ${err.message}`);
        throw `Error beautifying file: ${err.message}`;
    }
};

handler.command = /^(beautyjszip|beautycsszip|beautyhtmlzip)$/i;

export default handler;