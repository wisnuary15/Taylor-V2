import uploadFile from "./uploadFile.js";
export default async function(inp) {
  try {
    return await uploadFile(inp) || null;
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
}
