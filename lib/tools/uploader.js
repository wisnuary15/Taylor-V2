import fetch from "node-fetch";
import {
    v4 as uuidv4
} from "uuid";
import crypto from "crypto";
import {
    FormData,
    Blob
} from "formdata-node";
import {
    fileTypeFromBuffer
} from "file-type";
import axios from "axios";
import fakeUserAgent from "fake-useragent";
import cheerio from "cheerio";
import ora from "ora";
import chalk from "chalk";
const referer = "https://krakenfiles.com";
const uloadUrlRegexStr = /url: "([^"]+)"/;
const generateSlug = crypto.createHash('md5').update(`${Date.now()}-${uuidv4()}`).digest('hex').substring(0, 8);
const createFormData = async (content, fieldName) => {
    const {
        ext,
        mime
    } = await fileTypeFromBuffer(content) || {
        ext: 'bin',
        mime: 'application/octet-stream'
    };
    const blob = new Blob([content], {
        type: mime || 'application/octet-stream'
    });
    const formData = new FormData();
    formData.append(fieldName, blob, `${generateSlug}.${ext || 'bin'}`);
    return formData;
};
const handleErrorResponse = (error, spinner) => {
    spinner.fail(chalk.red("Failed"));
    console.error(chalk.red("Error:"), error.message);
    throw error;
};
const createSpinner = (text) => ora({
    text,
    spinner: "moon"
});
class Uploader {
    async telegraPh(content) {
        const spinner = createSpinner("Uploading to Telegra.ph").start();
        try {
            const formData = await createFormData(content, "file");
            const res = await fetch("https://telegra.ph/upload", {
                method: "POST",
                body: formData
            });
            const img = await res.json();
            if (img.error) throw img.error;
            spinner.succeed(chalk.green("Uploaded to Telegra.ph"));
            return `https://telegra.ph${img[0]?.src}`;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async uploadPomf2(content) {
        const spinner = createSpinner("Uploading to Pomf2").start();
        try {
            const formData = await createFormData(content, "files[]");
            const res = await fetch("https://pomf2.lain.la/upload.php", {
                method: "POST",
                body: formData
            });
            const json = await res.json();
            if (!json.success) throw json;
            spinner.succeed(chalk.green("Uploaded to Pomf2"));
            return json.files[0]?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async ucarecdn(content) {
        const spinner = createSpinner("Uploading to Ucarecdn").start();
        try {
            const formData = await createFormData(content, "file");
            formData.append("UPLOADCARE_PUB_KEY", "demopublickey");
            formData.append("UPLOADCARE_STORE", "1");
            const response = await fetch("https://upload.uploadcare.com/base/", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            const {
                file
            } = await response.json();
            spinner.succeed(chalk.green("Uploaded to Ucarecdn"));
            return `https://ucarecdn.com/${file}/${generateSlug}.${ext || 'bin'}`;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async transfersh(content) {
        const spinner = createSpinner("Uploading to Transfer.sh").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://transfer.sh/", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Transfer.sh"));
            return await response.text();
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async freeImage(content) {
        const spinner = createSpinner("Uploading to FreeImage.host").start();
        try {
            const apiKey = '6d207e02198a847aa98d0a2a901485a5';
            const uploadUrl = 'https://freeimage.host/api/1/upload';
            const formData = new FormData();
            formData.append('key', apiKey);
            formData.append('action', 'upload');
            formData.append('source', content.toString('base64'));
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            spinner.succeed(chalk.green("Uploaded to FreeImage.host"));
            return response.data?.image.url || response.data?.image?.image.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async top4top(content) {
        const spinner = createSpinner("Uploading to Top4Top").start();
        try {
            const kyResponse = await fetch("https://top4top.io/index.php");
            const sid = await kyResponse.text();
            const idd = cheerio.load(sid)('form#uploader input').attr('value');
            const formData = await createFormData(content, "file_0_");
            formData.append("submitr", "[ رفع الملفات ]");
            formData.append("sid", idd);
            const uploadUrl = "https://top4top.io/index.php";
            const uploadOptions = {
                method: "POST",
                body: formData
            };
            const uploadResponse = await fetch(uploadUrl, uploadOptions);
            const output = await uploadResponse.text();
            const informationSection = cheerio.load(output)('div.alert-warning ul.index_info li span');
            const result = informationSection.find('a').attr('href') || informationSection.find('.inputbody p.btitle:contains("رابط الصورة المباشر") + input').val() || informationSection.find('.inputbody p.btitle:contains("رابط الحذف") + input').val()
            spinner.succeed(chalk.green("Uploaded to Top4Top"));
            return result || null;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async tmpfiles(content) {
        const spinner = createSpinner("Uploading to Tmpfiles.org").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://tmpfiles.org/api/v1/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Tmpfiles.org"));
            const result = await response.json();
            const originalURL = result?.data?.url;
            const shortenedURL = originalURL ? `https://tmpfiles.org/dl/${originalURL.split('/').slice(-2).join('/')}` : null;
            return shortenedURL;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async pixeldrain(content) {
        const spinner = createSpinner("Uploading to Pixeldrain").start();
        try {
            const formData = await createFormData(content, "file");
            formData.append("anonymous", "False");
            const response = await fetch("https://pixeldrain.com/api/file", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            const {
                id
            } = await response.json();
            spinner.succeed(chalk.green("Uploaded to Pixeldrain"));
            return `https://pixeldrain.com/api/file/${id}`;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async nullbyte(content) {
        const spinner = createSpinner("Uploading to 0x0.st").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("http://0x0.st", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to 0x0.st"));
            return await response.text();
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async uploadToKraken(content) {
        const spinner = createSpinner("Uploading to Krakenfiles.com").start();
        try {
            const {
                data
            } = await axios.get(referer);
            const uploadUrl = data?.match(uloadUrlRegexStr)?.[1];
            if (!uploadUrl) throw new Error("No regex match.");
            const formData = await createFormData(content, "files[]");
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    Referer: referer,
                    "Content-Type": "multipart/form-data"
                },
            });
            const {
                files
            } = response.data;
            const file = files[0];
            spinner.succeed(chalk.green("Uploaded to Krakenfiles.com"));
            const html = await (await fetch(referer + file.url)).text();
            const linkValue = cheerio.load(html)('#link1').val();
            return linkValue;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async hostfile(content) {
        const spinner = createSpinner("Uploading to Hostfile.my.id").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://hostfile.my.id/api/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Hostfile.my.id"));
            const base64Data = await response.text();
            const result = JSON.parse(base64Data);
            return result.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async gofile(content) {
        const spinner = createSpinner("Uploading to Gofile.io").start();
        try {
            const formData = await createFormData(content, "file");
            const getServer = await (await fetch("https://api.gofile.io/getServer", {
                method: "GET",
            })).json();
            const response = await fetch(`https://${getServer.data?.server}.gofile.io/uploadFile`, {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Gofile.io"));
            const result = await response.json();
            return `https://${getServer.data?.server}.gofile.io/download/${result.data?.fileId}/${result.data?.fileName}`
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async fileio(content) {
        const spinner = createSpinner("Uploading to File.io").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://file.io", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to File.io"));
            const result = await response.json();
            return result.link;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async filebin(content) {
        const spinner = createSpinner("Uploading to Filebin.net").start();
        try {
            const formData = await createFormData(content, "file");
            const binId = crypto.createHash('md5').update(`${Date.now()}-${uuidv4()}`).digest('hex').substring(0, 16);
            const uploadURL = `https://filebin.net/${binId}/${generateSlug}.${ext || 'bin'}`;
            const response = await fetch(uploadURL, {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Filebin.net"));
            const output = await response.json();
            return `https://filebin.net/${output.bin?.id}/${output.file?.filename}`;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async fexnet(content) {
        const spinner = createSpinner("Uploading to Fex.net").start();
        try {
            const formData = await createFormData(content, "file");
            formData.append("filename", `${generateSlug}.${ext || 'bin'}`);
            const response = await fetch("https://fexnet.zendesk.com/api/v2/uploads.json", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent(),
                    Authorization: `Basic ${btoa("as@fexnet.com/token:1RQO68P13pmqFXorJUKp4P")}`,
                },
            });
            spinner.succeed(chalk.green("Uploaded to Fex.net"));
            const result = await response.json();
            return result.upload.attachment.content_url
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async uploadToDiscdn(content) {
        const spinner = createSpinner("Uploading to Discord CDN").start();
        try {
            const formData = await createFormData(content, "files[0]");
            const res = await fetch("https://discord.com/api/v9/channels/1180731738176094228/messages", {
                method: "POST",
                headers: {
                    Authorization: "Bot MTE4MDcyODk4MjAzNjA0MTczOA.GtqzcS.grSeXjgylvsY_e7YxYi4acHKIrYTabaOnubOx8"
                },
                body: formData,
            });
            spinner.succeed(chalk.green("Uploaded to Discord CDN"));
            return await res.json();
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async catbox(content) {
        const spinner = createSpinner("Uploading to Catbox.moe").start();
        try {
            const formData = await createFormData(content, "fileToUpload");
            formData.append("reqtype", "fileupload");
            const response = await fetch("https://catbox.moe/user/api.php", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Catbox.moe"));
            return await response.text();
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async mediaUpload(content) {
        const spinner = createSpinner("Uploading to Media-upload.net").start();
        try {
            const formData = await createFormData(content, "files[]");
            const response = await fetch("https://media-upload.net/php/ajax_upload_file.php", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Media-upload.net"));
            const files = await response.json();
            return files.files[0]?.fileUrl;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async sazumi(content) {
        const spinner = createSpinner("Uploading to sazumi").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://cdn.sazumi.moe/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to sazumi"));
            const basetextData = await response.text();
            return basetextData;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Imgbb(content, exp, key) {
        const spinner = createSpinner("Uploading to Imgbb").start();
        try {
            const formData = await createFormData(content, "image");
            formData.append('key', key || 'c93b7d1d3f7a145263d4651c46ba55e4');
            formData.append('expiration', exp || 600);
            const response = await fetch("https://api.imgbb.com/1/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Imgbb"));
            const files = await response.json();
            return files.data?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async fileDitch(content) {
        const spinner = createSpinner("Uploading to FileDitch").start();
        try {
            const formData = await createFormData(content, "files[]");
            const response = await fetch("https://up1.fileditch.com/upload.php", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to FileDitch"));
            const files = await response.json();
            return files.files[0]?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Uguu(content) {
        const spinner = createSpinner("Uploading to Uguu").start();
        try {
            const formData = await createFormData(content, "files[]");
            const response = await fetch("https://uguu.se/upload?output=json", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Uguu"));
            const files = await response.json();
            return files.files[0]?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Doodstream(content, key) {
        const spinner = createSpinner("Uploading to Doodstream").start();
        try {
            const formData = await createFormData(content, "file");
            formData.append('type', 'submit');
            formData.append('api_key', key || '13527p8pcv54of4yjeryk');
            const response = await fetch((await (await fetch('https://doodapi.com/api/upload/server?key=' + (key || '13527p8pcv54of4yjeryk'))).json()).result, {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Doodstream"));
            const files = await response.json();
            return files.files[0]?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Videy(content) {
        const spinner = createSpinner("Uploading to Videy.co").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch('https://videy.co/api/upload', {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Videy.co"));
            const {
                id
            } = await response.json();
            return `https://cdn.videy.co/${id}.mp4`;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Gozic(content) {
        const spinner = createSpinner("Uploading to Gozic.vn").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch('https://appbanhang.gozic.vn/api/upload', {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Gozic.vn"));
            const {
                url: result
            } = await response.json();
            return result;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async UploadEE(content) {
        const spinner = createSpinner("Uploading to Upload.ee").start();
        try {
            const baseUrl = "https://www.upload.ee";
            const finishUrl = "/?page=finished&upload_id=";
            const response = await fetch(`${baseUrl}/ubr_link_upload.php?rnd_id=${Date.now()}`);
            if (!response.ok) throw new Error("Failed to get upload link");
            const responseBody = await response.text();
            const uploadId = (responseBody.match(/startUpload\("(.+?)"/) || [])[1];
            if (!uploadId) throw new Error("Unable to obtain Upload ID");
            const formData = await createFormData(content, "upfile_0");
            formData.append("link", "");
            formData.append("email", "");
            formData.append("category", "cat_file");
            formData.append("big_resize", "none");
            formData.append("small_resize", "120x90");
            const uploadResponse = await fetch(`${baseUrl}/cgi-bin/ubr_upload.pl?X-Progress-ID=${encodeURIComponent(uploadId)}&upload_id=${encodeURIComponent(uploadId)}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Referer': baseUrl
                }
            });
            if (!uploadResponse.ok) throw new Error("File upload failed");
            const firstData = await uploadResponse.text();
            const $ = cheerio.load(firstData);
            const viewUrl = $("input#file_src").val() || "";
            if (!viewUrl) throw new Error("File upload failed");
            const viewResponse = await fetch(viewUrl);
            const finalData = await viewResponse.text();
            const $$ = cheerio.load(finalData);
            const downUrl = $$('#d_l').attr('href') || "";
            if (!downUrl) throw new Error("File upload failed");
            spinner.succeed(chalk.green("Uploaded to Upload.ee"));
            return downUrl;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Uploadify(content) {
        const spinner = createSpinner("Uploading to Uploadify.net").start();
        try {
            const formData = await createFormData(content, "files[]");
            const response = await fetch('https://uploadify.net/core/page/ajax/file_upload_handler.ajax.php?r=uploadify.net&p=https&csaKey1=1af7f41511fe40833ff1aa0505ace436a09dcb7e6e35788aaad2ef29d0331596&csaKey2=256b861c64ec1e4d1007eb16c68b3cfc5cb8170658b1053b7185653640bb3909', {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Uploadify.net"));
            const files = await response.json();
            return files[0]?.url;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
    async Kitc(content) {
        const spinner = createSpinner("Uploading to Ki.tc").start();
        try {
            const formData = await createFormData(content, "file");
            const response = await fetch("https://ki.tc/file/u/", {
                method: "POST",
                body: formData,
                headers: {
                    "User-Agent": fakeUserAgent()
                },
            });
            spinner.succeed(chalk.green("Uploaded to Ki.tc"));
            const result = await response.json();
            return result.file?.link;
        } catch (error) {
            handleErrorResponse(error, spinner);
        }
    }
}
export {
    Uploader
};
