import axios from "axios";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
async function imgToPdf(imageSources) {
  try {
    const buffers = [],
      pdfDoc = new PDFDocument,
      pdfStream = new PassThrough;
    if (pdfDoc.pipe(pdfStream), !imageSources || 0 === imageSources.length) return console.log("No images found."),
      null;
    for (const [index, imageSource] of imageSources.entries()) try {
      let imageData;
      if ("string" == typeof imageSource) {
        const imageResponse = await axios.get(imageSource, {
          responseType: "arraybuffer"
        });
        imageData = Buffer.from(imageResponse.data);
      } else {
        if (!Buffer.isBuffer(imageSource)) {
          console.error(`Invalid image source at index ${index + 1}`);
          continue;
        }
        imageData = imageSource;
      }
      await pdfDoc.addPage().image(imageData, {
        fit: [pdfDoc.page.width, pdfDoc.page.height],
        align: "center",
        valign: "center"
      });
    } catch (error) {
      console.error(`Error processing image at index ${index + 1}:`, error);
    }
    return pdfDoc.end(), pdfStream.on("data", (chunk => buffers.push(chunk))), new Promise((resolve => pdfStream.on("end", (() => resolve(Buffer.concat(buffers))))));
  } catch (error) {
    throw console.error("Error fetching data:", error), error;
  }
}
async function textToPdf(text) {
  try {
    const buffers = [],
      pdfDoc = new PDFDocument,
      pdfStream = new PassThrough;
    pdfDoc.pipe(pdfStream);
    const lines = text.split("\n");
    for (const line of lines) pdfDoc.text(line);
    return pdfDoc.end(), pdfStream.on("data", (chunk => buffers.push(chunk))), new Promise((resolve => pdfStream.on("end", (() => resolve(Buffer.concat(buffers))))));
  } catch (error) {
    throw console.error("Error converting text to PDF:", error), error;
  }
}
export { imgToPdf, textToPdf };