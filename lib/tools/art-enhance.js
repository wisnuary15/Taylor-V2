import fetch from 'node-fetch';
import {
    FormData,
    Blob
} from 'formdata-node';
import {
    fileTypeFromBuffer
} from 'file-type';
import Replicate from "replicate";
import crypto from "crypto";
class ImageProcessor {
    constructor({
        token = '',
        replicate = ''
    }) {
        this.token = token;
        this.replicate = replicate;
    }
    async colorizePicture(filename, content) {
        try {
            const endpoint = "https://api.hotpot.ai/colorize-picture";
            const alphabet = this.generateRequestId();
            const payload = {
                'requestId': `${alphabet}`,
                'renderFactor': '20'
            };
            const blob = new Blob([content], {
                type: 'image/jpeg'
            });
            const formData = new FormData();
            formData.append('image', blob, {
                filename: filename
            });
            const headers = {
                'Authorization': this.token,
                ...formData.getHeaders()
            };
            const response = await this.sendRequest(endpoint, 'POST', headers, payload, formData);
            return await response.arrayBuffer();
        } catch (error) {
            throw new Error(`Error processing image: ${error.message}`);
        }
    }
    async restorePicture(filename, content, withScratch = false) {
        try {
            const endpoint = "https://api.hotpot.ai/restore-picture";
            const alphabet = this.generateRequestId();
            const payload = {
                'requestId': `${alphabet}`,
                'withScratch': withScratch
            };
            const blob = new Blob([content], {
                type: 'image/jpeg'
            });
            const formData = new FormData();
            formData.append('image', blob, {
                filename: filename
            });
            const headers = {
                'Authorization': this.token,
                ...formData.getHeaders()
            };
            const response = await this.sendRequest(endpoint, 'POST', headers, payload, formData);
            return await response.arrayBuffer();
        } catch (error) {
            throw new Error(`Error restoring picture: ${error.message}`);
        }
    }
    async removeBackground(content) {
        try {
            const fileType = await fileTypeFromBuffer(content);
            if (!fileType || !fileType.mime.startsWith('image/')) {
                throw new Error('Invalid file type. Only image files are supported.');
            }
            const base64Image = Buffer.from(content).toString('base64');
            const payload = JSON.stringify({
                'image': "data:image/" + fileType.ext + ";base64," + base64Image,
            });
            const headers = {
                'Content-Type': 'application/json'
            };
            const endpoint = "https://backend.zyro.com/v1/ai/remove-background";
            const response = await this.sendRequest(endpoint, 'POST', headers, payload);
            const b64String = response.result;
            const encodedString = b64String.split(",")[1];
            const b64Buffer = Buffer.from(encodedString, 'base64');
            return b64Buffer;
        } catch (error) {
            throw new Error(`Error removing background: ${error.message}`);
        }
    }
    async upscaleImage(content) {
        try {
            const fileType = await fileTypeFromBuffer(content);
            if (!fileType || !fileType.mime.startsWith('image/')) {
                throw new Error('Invalid file type. Only image files are supported.');
            }
            const base64Image = Buffer.from(content).toString('base64');
            const payload = JSON.stringify({
                'image': "data:image/" + fileType.ext + ";base64," + base64Image,
            });
            const headers = {
                'Content-Type': 'application/json'
            };
            const endpoint = "https://backend.zyro.com/v1/ai/upscale-image";
            const response = await this.sendRequest(endpoint, 'POST', headers, payload);
            const b64String = response.result;
            const encodedString = b64String.split(",")[1];
            const b64Buffer = Buffer.from(encodedString, 'base64');
            return b64Buffer;
        } catch (error) {
            throw new Error(`Error upscaling image: ${error.message}`);
        }
    }
    async artEnhance(img) {
        try {
            const replicate = new Replicate({
                auth: this.replicate
            });
            const model = "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3";
            const input = {
                img
            };
            const output = await replicate.run(model, {
                input
            });
            const imageArrayBuffer = Buffer.from(output, "base64").buffer;
            return imageArrayBuffer;
        } catch (error) {
            throw new Error(`Error enhancing art: ${error.message}`);
        }
    }
    async sendRequest(url, method, headers, data, formData = null) {
        const requestOptions = {
            method: method,
            headers: headers,
            body: method === 'POST' && formData ? formData : data,
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    }
    generateRequestId() {
        return crypto.randomBytes(8).toString("hex");
    }
}
export {
    ImageProcessor
};
