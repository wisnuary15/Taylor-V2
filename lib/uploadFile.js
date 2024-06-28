import {
  Uploader
} from "./tools/uploader.js";
import ora from "ora";
import chalk from "chalk";
import {
  fileTypeFromBuffer
} from "file-type";
const upload = new Uploader(),
  imageProviders = [{
    name: "TelegraPh",
    func: upload.telegraPh
  }, {
    name: "FreeImage",
    func: upload.freeImage
  }, {
    name: "Catbox",
    func: upload.catbox
  }, {
    name: "Uguu",
    func: upload.Uguu
  }, {
    name: "Imgbb",
    func: upload.Imgbb
  }, {
    name: "Pixeldrain",
    func: upload.pixeldrain
  }],
  otherProviders = [{
    name: "UploadPomf2",
    func: upload.uploadPomf2
  }, {
    name: "Tmpfiles",
    func: upload.tmpfiles
  }, {
    name: "Fex.net",
    func: upload.fexnet
  }, {
    name: "Gofile",
    func: upload.gofile
  }, {
    name: "Nullbyte",
    func: upload.nullbyte
  }, {
    name: "Ucarecdn",
    func: upload.ucarecdn
  }, {
    name: "MediaUpload",
    func: upload.mediaUpload
  }, {
    name: "Top4top",
    func: upload.top4top
  }, {
    name: "Hostfile",
    func: upload.hostfile
  }, {
    name: "Transfersh",
    func: upload.transfersh
  }, {
    name: "Upload.ee",
    func: upload.UploadEE
  }, {
    name: "Uploadify",
    func: upload.Uploadify
  }, {
    name: "Ki.tc",
    func: upload.Kitc
  }, {
    name: "stylar.ai",
    func: upload.stylar
  }, {
    name: "Gozic",
    func: upload.Gozic
  }, {
    name: "Videy",
    func: upload.Videy
  }, {
    name: "Doodstream",
    func: upload.Doodstream
  }, {
    name: "Filebin",
    func: upload.filebin
  }, {
    name: "Fileio",
    func: upload.fileio
  }, {
    name: "Sazumi",
    func: upload.sazumi
  }, {
    name: "UploadToDiscdn",
    func: upload.uploadToDiscdn
  }, {
    name: "UploadToKraken",
    func: upload.uploadToKraken
  }],
  allProviders = [...imageProviders, ...otherProviders],
  providers = {
    image: imageProviders,
    all: allProviders
  },
  createSpinner = text => ora({
    text: text,
    spinner: "moon"
  });
export default async function(inp, option = "all") {
  const spinner = createSpinner("Uploading...").start();
  try {
    const fileType = await fileTypeFromBuffer(inp),
      isImage = fileType?.mime.startsWith("image/"),
      providerList = isImage ? providers.image : providers.all,
      maxIndex = providerList.length,
      validIndex = !isNaN(Number(option)) && Number(option) >= 1 && Number(option) <= maxIndex;
    if ("image" !== option && "all" !== option && !validIndex) {
      const indexList = providerList.map((provider, index) => `${index + 1}: ${provider.name}`).join("\n");
      throw new Error(`Invalid input. Please provide 'image', 'all', or a valid index.\nAvailable Indexes:\n${indexList}`);
    }
    const selectedProviders = "image" === option ? providers.image : "all" === option ? providers.all : validIndex ? [providerList[Number(option) - 1]] : providers.all;
    for (const {
        name,
        func
      }
      of selectedProviders) try {
      const result = await func(inp);
      if (result) return spinner.succeed(chalk.green(`Upload successful with ${name}`)),
        result;
      throw new Error("Upload result is empty or null");
    } catch (e) {
      spinner.fail(chalk.red(`Upload failed with ${name}: ${e.message}`));
    }
    throw new Error("All providers failed to upload.");
  } catch (error) {
    throw spinner.stop(), new Error(`Error during upload: ${error.message}`);
  }
}