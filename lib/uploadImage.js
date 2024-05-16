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
    image: [{
            name: "Pomf2",
            func: upload.uploadPomf2
        },
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
            name: "File.io",
            func: upload.fileio
        }
    ],
    default: [{
            name: "Top4top",
            func: upload.top4top
        },
        {
            name: "Tmpfiles",
            func: upload.tmpfiles
        },
        {
            name: "Fex.net",
            func: upload.fexnet
        },
        {
            name: "FileDitch",
            func: upload.fileDitch
        },
        {
            name: "Sazumi",
            func: upload.sazumi
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
            name: "Hostfile",
            func: upload.hostfile
        },
        {
            name: "MediaUpload",
            func: upload.mediaUpload
        },
        {
            name: "Nullbyte",
            func: upload.nullbyte
        },
        {
            name: "Transfersh",
            func: upload.transfersh
        },
        {
            name: "Ucarecdn",
            func: upload.ucarecdn
        },
        {
            name: "Uguu",
            func: upload.Uguu
        },
        {
            name: "Discdn",
            func: upload.uploadToDiscdn
        },
        {
            name: "Kraken",
            func: upload.uploadToKraken
        },
        {
            name: "File.io",
            func: upload.fileio
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
    const selectedProviders = fileType?.mime.startsWith('image/') ? providers.image : providers.default;

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