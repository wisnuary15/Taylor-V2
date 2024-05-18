import {
    Uploader
} from "./tools/uploader.js";
import ora from "ora";
import chalk from "chalk";
import {
    fileTypeFromBuffer
} from "file-type";

const upload = new Uploader();
const providers = {
    image: [
        {
            name: "Telegraph",
            func: upload.telegraPh
        },
        {
            name: "Catbox",
            func: upload.catbox
        },
        {
            name: "Pixeldrain",
            func: upload.pixeldrain
        },
        {
            name: "Pomf2",
            func: upload.uploadPomf2
        },
        {
            name: "FreeImage",
            func: upload.freeImage
        }
    ],
    other: [
        {
            name: "Tmpfiles",
            func: upload.tmpfiles
        },
        {
            name: "Uguu",
            func: upload.Uguu
        },
        {
            name: "Gofile",
            func: upload.gofile
        },
        {
            name: "Filebin",
            func: upload.filebin
        },
        {
            name: "Discdn",
            func: upload.uploadToDiscdn
        },
        {
            name: "Hostfile",
            func: upload.hostfile
        },
        {
            name: "MediaUpload",
            func: upload.mediaUpload
        },
        {
            name: "FileDitch",
            func: upload.fileDitch
        },
        {
            name: "Fex.net",
            func: upload.fexnet
        },
        {
            name: "Nullbyte",
            func: upload.nullbyte
        },
        {
            name: "Sazumi",
            func: upload.sazumi
        },
        {
            name: "Ucarecdn",
            func: upload.ucarecdn
        },
        {
            name: "Top4top",
            func: upload.top4top
        },
        {
            name: "Kraken",
            func: upload.uploadToKraken
        }
    ]
};

const createSpinner = (text) => ora({
    text,
    spinner: "moon"
});

/**
 * @param {Buffer} inp
 * @returns {Promise<string>}
 */
export default async function(inp) {
    const spinner = createSpinner('Uploading...').start();
    const fileType = await fileTypeFromBuffer(inp);
    const selectedProviders = fileType?.mime.startsWith('image/') ? providers.image : providers.other;

    for (let {
            name,
            func
        }
        of selectedProviders) {
        try {
            const result = await func(inp);
            spinner.succeed(chalk.green(`Upload successful with ${name}`));
            return result;
        } catch (e) {
            spinner.fail(chalk.red(`Upload failed with ${name}: ${e.message}`));
            console.error(chalk.red(`Upload failed with ${name}: ${e.message}`));
        }
    }
    spinner.stop();
    throw new Error("All providers failed to upload.");
}