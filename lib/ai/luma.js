import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
const _prompt = "I flew to the roof";
const _accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidXNlcl91dWlkIjoiYmVhOTlkMDAtNDc2NS00NDFjLWI0ZjktYjdkMGU1NjIxOTk1IiwiY2xpZW50X2lkIjoiIn0sImV4cCI6MTcxODk3MjEwMH0.vZt6jyHErsa8yuSWRVeYpvlh5xDOZnocI9z36n5QgSA";
    
export async function dreamMachineMake(prompt = _prompt, accessToken = _accessToken, imgFile = null) {
    const url = "https://internal-api.virginia.labs.lumalabs.ai/api/photon/v1/generations/";

    const payload = {
        user_prompt: prompt,
        aspect_ratio: "16:9",
        expand_prompt: true,
        image_url: imgFile ? await uploadFile(accessToken, imgFile) : undefined
    };

    const headers = {
        "Cookie": `access_token=${accessToken}`,
        "Origin": "https://lumalabs.ai",
        "Referer": "https://lumalabs.ai",
        "Content-Type": "application/json"
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    const videoUrl = await waitData(result[0]?.id);
    return videoUrl;
}

export async function refreshDreamMachine(accessToken) {
    const url = "https://internal-api.virginia.labs.lumalabs.ai/api/photon/v1/user/generations/";
    const params = new URLSearchParams({ offset: "0", limit: "10" });

    const headers = { "Cookie": `access_token=${accessToken}` };

    const response = await fetch(`${url}?${params}`, { method: 'GET', headers: headers });

    return await response.json();
}

async function getSignedUpload(accessToken) {
    const url = "https://internal-api.virginia.labs.lumalabs.ai/api/photon/v1/generations/file_upload";
    const params = new URLSearchParams({ file_type: 'image', filename: 'file.jpg' });

    const headers = { "Cookie": `access_token=${accessToken}` };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: params
    });

    if (!response.ok) throw new Error('Failed to get signed upload URL');
    return await response.json();
}

export async function uploadFile(accessToken, filePath) {
    try {
        const { presigned_url, public_url } = await getSignedUpload(accessToken);
        const file = fs.readFileSync(filePath);

        const response = await fetch(presigned_url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'image/*',
                'Referer': 'https://lumalabs.ai',
                'Origin': 'https://lumalabs.ai'
            },
            body: file
        });

        if (response.status !== 200) throw new Error('Upload failed');
        console.log("Upload successful:", public_url);
        return public_url;
    } catch (error) {
        console.error("Upload failed. Error uploading image:", error);
    }
}

export async function uploadImage(accessToken, filePath) {
    const url = "https://internal-api.virginia.labs.lumalabs.ai/api/photon/v1/generations/file_upload?file_type=image&filename=file.jpg";
    const file = fs.readFileSync(filePath);

    const headers = {
        "Cookie": `access_token=${accessToken}`,
        "User-Agent": "Apipost/8 (https://www.apipost.cn)"
    };

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    const { public_url } = await response.json();
    console.log(public_url);
    return public_url;
}

async function waitData(id) {
    const maxTimeInSeconds = 1800; // 30 menit
    const startTime = Date.now();
    let videoUrl = null;

    while (!videoUrl && (Date.now() - startTime) < maxTimeInSeconds * 1000) {
        try {
            const response = await fetch(`https://internal-api.virginia.labs.lumalabs.ai/api/photon/v1/generations/${id}`);
            const result = await response.json();
            if (result?.state === "completed") {
                videoUrl = result;
                break;
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
        await new Promise(resolve => setTimeout(resolve, 15000)); // 15 detik
    }

    if (!videoUrl) {
        throw new Error('State "completed" not found within max time');
    }

    return videoUrl;
}
