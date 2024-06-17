import fs from "fs";
import path from "path";
import nodezip from "node-zip";
import sharp from "sharp";
import pdfkit from "pdfkit";
export async function pushImageToPdf(pdf, imageFile, pdfName) {
  const image = sharp(imageFile),
    metadata = await image.metadata();
  return pdf ? pdf.addPage({
    size: [metadata.width, metadata.height],
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  }) : (pdf = new pdfkit({
    size: [metadata.width, metadata.height],
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  })).pipe(fs.createWriteStream(pdfName)), pdf.image(imageFile, {
    width: metadata.width,
    height: metadata.height,
    align: "center",
    valign: "center"
  }), pdf;
}
export async function convertZipToPdf(zipFile, pdfFile) {
  const zip = new nodezip(fs.readFileSync(zipFile, {
    encoding: "binary"
  }), {
    base64: !1,
    checkCRC32: !0
  });
  let pdf = null;
  for (const fileName of Object.keys(zip.files)) try {
    const imageBuffer = Buffer.from(zip.files[fileName]._data, "binary");
    pdf = await pushImageToPdf(pdf, imageBuffer, pdfFile), console.log("Add:", fileName);
  } catch (e) {
    console.log("Skip:", fileName);
  }
  pdf && pdf.end();
}