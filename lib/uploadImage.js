import uploadFile from './uploadFile.js';

/**
 * @param {Buffer} inp
 * @returns {Promise<string>}
 */
export default async function (inp) {
    try {
        const result = await uploadFile(inp);
        return result || null;
    } catch (error) {
        console.error('Upload failed:', error.message);
        }
}
