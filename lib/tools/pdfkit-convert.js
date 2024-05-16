import axios from 'axios';
import PDFDocument from 'pdfkit';
import {
    PassThrough
} from 'stream';

async function imgToPdf(imageSources) {
    try {
        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        if (!imageSources || imageSources.length === 0) {
            console.log('No images found.');
            return null;
        }

        for (const [index, imageSource] of imageSources.entries()) {
            try {
                let imageData;

                if (typeof imageSource === 'string') {
                    const imageResponse = await axios.get(imageSource, {
                        responseType: 'arraybuffer',
                    });
                    imageData = Buffer.from(imageResponse.data);
                } else if (Buffer.isBuffer(imageSource)) {
                    imageData = imageSource;
                } else {
                    console.error(`Invalid image source at index ${index + 1}`);
                    continue;
                }

                await pdfDoc.addPage().image(imageData, {
                    fit: [pdfDoc.page.width, pdfDoc.page.height],
                    align: 'center',
                    valign: 'center',
                });
            } catch (error) {
                console.error(`Error processing image at index ${index + 1}:`, error);
            }
        }

        pdfDoc.end();

        pdfStream.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve) => pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function textToPdf(text) {
    try {
        const buffers = [];
        const pdfDoc = new PDFDocument();
        const pdfStream = new PassThrough();
        pdfDoc.pipe(pdfStream);

        const lines = text.split('\n');

        for (const line of lines) {
            pdfDoc.text(line);
        }

        pdfDoc.end();

        pdfStream.on('data', (chunk) => buffers.push(chunk));

        return new Promise((resolve) => pdfStream.on('end', () => resolve(Buffer.concat(buffers))));
    } catch (error) {
        console.error('Error converting text to PDF:', error);
        throw error;
    }
}

export {
    imgToPdf,
    textToPdf
};