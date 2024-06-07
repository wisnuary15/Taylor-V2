import {
  FormData,
  Blob
} from "formdata-node";
import {
  fileTypeFromBuffer
} from "file-type";
import {
  fetch
} from "undici";
import crypto from "crypto";
class VyroAI {
  constructor({
    key = "vk-dk3DMbasbyjxOeOVu9k8lqnDAiKYs1NaqMEOBT6kwzHJS",
    link = true,
    buffer = true
  }) {
    this.baseUrl = "https://api.vyro.ai/v1/imagine/api/";
    this.commonHeaders = {
      Authorization: `Bearer ${key}`,
    };
    this.defaultOptions = {
      url: link,
      buffer: buffer
    };
  }
  async catbox(content) {
    try {
      const {
        ext,
        mime
      } = await fileTypeFromBuffer(content) || {};
      const blob = new Blob([content], {
        type: mime
      });
      const formData = new FormData();
      const randomBytes = crypto.randomBytes(5).toString("hex");
      formData.append("reqtype", "fileupload");
      formData.append("fileToUpload", blob, randomBytes + "." + ext);
      const uploadURL = "https://catbox.moe/user/api.php";
      const response = await fetch(uploadURL, {
        method: "POST",
        body: formData,
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
        },
      });
      const output = await response.text();
      return output || null;
    } catch (e) {
      throw e;
    }
  }
  async makeRequest(url, formdata, options = {}) {
    const requestOptions = {
      method: "POST",
      body: formdata,
      headers: {
        ...this.commonHeaders
      },
    };
    const mergedOptions = {
      ...this.defaultOptions,
      ...options
    };
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to make request. Status: ${response.status}`);
      }
      if (mergedOptions.url && !mergedOptions.buffer) {
        return {
          link: await this.catbox(await response.arrayBuffer())
        };
      } else if (!mergedOptions.url && mergedOptions.buffer) {
        return {
          buffer: Buffer.from(await response.arrayBuffer())
        };
      } else if (mergedOptions.url && mergedOptions.buffer) {
        return {
          buffer: Buffer.from(await response.arrayBuffer()),
          link: await this.catbox(await response.arrayBuffer())
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error making request: ${error.message}`);
    }
  }
  async generateImage(prompt, styleId) {
    const url = `${this.baseUrl}generations`;
    const formdata = new FormData();
    formdata.append("prompt", prompt);
    formdata.append("style_id", styleId);
    return await this.makeRequest(url, formdata);
  }
  async remixImage(prompt, styleId, imageBuffer) {
    const url = `${this.baseUrl}edits/remix`;
    const {
      mime
    } = await fileTypeFromBuffer(imageBuffer) || {};
    const image = new Blob([imageBuffer.toArrayBuffer()], {
      type: mime
    });
    const formdata = new FormData();
    formdata.append("style_id", styleId);
    formdata.append("prompt", prompt);
    formdata.append("image", image);
    return await this.makeRequest(url, formdata);
  }
  async inpaintImage(prompt, imageBuffer, maskBuffer) {
    const url = `${this.baseUrl}edits/inpaint`;
    const img = await fileTypeFromBuffer(imageBuffer) || {};
    const image = new Blob([imageBuffer.toArrayBuffer()], {
      type: img.mime
    });
    const msk = await fileTypeFromBuffer(maskBuffer) || {};
    const mask = new Blob([maskBuffer.toArrayBuffer()], {
      type: msk.mime
    });
    const formdata = new FormData();
    formdata.append("prompt", prompt);
    formdata.append("image", image);
    formdata.append("mask", mask);
    return await this.makeRequest(url, formdata);
  }
  async upscaleImage(imageBuffer) {
    const url = `${this.baseUrl}upscale`;
    const {
      mime
    } = await fileTypeFromBuffer(imageBuffer) || {};
    const image = new Blob([imageBuffer.toArrayBuffer()], {
      type: mime
    });
    const formdata = new FormData();
    formdata.append("image", image);
    return await this.makeRequest(url, formdata);
  }
  async generateVariations(prompt, styleId, imageBuffer) {
    const url = `${this.baseUrl}generations/variations`;
    const {
      mime
    } = await fileTypeFromBuffer(imageBuffer) || {};
    const image = new Blob([imageBuffer.toArrayBuffer()], {
      type: mime
    });
    const formdata = new FormData();
    formdata.append("style_id", styleId);
    formdata.append("prompt", prompt);
    formdata.append("image", image);
    return await this.makeRequest(url, formdata);
  }
  async removeBackground(imageBuffer) {
    const url = `${this.baseUrl}background/remover`;
    const {
      mime
    } = await fileTypeFromBuffer(imageBuffer) || {};
    const image = new Blob([imageBuffer.toArrayBuffer()], {
      type: mime
    });
    const formdata = new FormData();
    formdata.append("image", image);
    return await this.makeRequest(url, formdata);
  }
}
export {
  VyroAI
};
