import {
  Uploader
} from "./tools/uploader.js";
import ora from "ora";
import chalk from "chalk";
import {
  fileTypeFromBuffer
} from "file-type";
import _ from "lodash";
const upload = new Uploader();
const getAllMethods = obj => _.chain(obj).thru(v => new Set(_.flatMapDeep(Object.getPrototypeOf(v), Object.getOwnPropertyNames))).filter(name => typeof obj[name] === "function").value();
const createProviders = methodNames => methodNames.map(name => ({
  name: name,
  func: upload[name]
}));
const methods = getAllMethods(upload);
const providers = {
  image: createProviders(_.filter(methods, v => /image|img|telegraph|pomf2|skylar|filezone/i.test(v))),
  all: createProviders(methods)
};
const createSpinner = q => ora({
  text: q,
  spinner: "moon"
});
export default async function(inp, option = "all") {
  const spinner = createSpinner("Uploading...").start();
  try {
    const fileType = await fileTypeFromBuffer(inp);
    const isImage = fileType?.mime.startsWith("image/");
    const providerList = isImage ? providers.image : providers.all;
    const validIndex = _.inRange(Number(option), 1, providerList.length + 1);
    if (!["image", "all"].includes(option) && !validIndex) {
      throw new Error(`Invalid input. Please provide 'image', 'all', or a valid index.\nAvailable Indexes:\n${providerList.map((p, i) => `${i + 1}: ${p.name}`).join("\n")}`);
    }
    const selectedProviders = option === "image" ? providers.image : option === "all" ? providers.all : [providerList[Number(option) - 1]];
    for (const {
        name,
        func
      }
      of selectedProviders) {
      try {
        const result = await func(inp);
        if (result) {
          spinner.succeed(chalk.green(`Upload successful with ${name}`));
          return result;
        }
        throw new Error("Upload result is empty or null");
      } catch (e) {
        spinner.fail(chalk.red(`Upload failed with ${name}: ${e.message}`));
      }
    }
    throw new Error("All providers failed to upload.");
  } catch (error) {
    spinner.stop();
    throw new Error(`Error during upload: ${error.message}`);
  }
}
