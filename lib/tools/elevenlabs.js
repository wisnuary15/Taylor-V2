import fetch from 'node-fetch';
const LABSURL = process.env.LABSURL || "https://api.elevenlabs.io";
const LABSKEY = process.env.LABSKEY || "2a0050b5932ff8d79f54418fa370d1c1";
const labsVoiceID = {
    "rachel": {
        "voice_id": "21m00Tcm4TlvDq8ikWAM"
    },
    "clyde": {
        "voice_id": "2EiwWnXFnvU5JabPnv8n"
    },
    "domi": {
        "voice_id": "AZnzlk1XvdvUeBnXmlld"
    },
    "dave": {
        "voice_id": "CYw3kZ02Hs0563khs1Fj"
    },
    "fin": {
        "voice_id": "D38z5RcWu1voky8WS1ja"
    },
    "bella": {
        "voice_id": "EXAVITQu4vr4xnSDxMaL"
    },
    "antoni": {
        "voice_id": "ErXwobaYiN019PkySvjV"
    },
    "thomas": {
        "voice_id": "GBv7mTt0atIp3Br8iCZE"
    },
    "charlie": {
        "voice_id": "IKne3meq5aSn9XLyUdCD"
    },
    "emily": {
        "voice_id": "LcfcDJNUP1GQjkzn1xUU"
    },
    "elli": {
        "voice_id": "MF3mGyEYCl7XYWbV9V6O"
    },
    "callum": {
        "voice_id": "N2lVS1w4EtoT3dr4eOWO"
    },
    "patrick": {
        "voice_id": "ODq5zmih8GrVes37Dizd"
    },
    "harry": {
        "voice_id": "SOYHLrjzK2X1ezoPC6cr"
    },
    "liam": {
        "voice_id": "TX3LPaxmHKxFdv7VOQHJ"
    },
    "dorothy": {
        "voice_id": "ThT5KcBeYPX3keUQqHPh"
    },
    "josh": {
        "voice_id": "TxGEqnHWrfWFTfGW9XjX"
    },
    "arnold": {
        "voice_id": "VR6AewLTigWG4xSOukaG"
    },
    "charlotte": {
        "voice_id": "XB0fDUnXU5powFXDhCwa"
    },
    "matilda": {
        "voice_id": "XrExE9yKIg1WjnnlVkGX"
    },
    "matthew": {
        "voice_id": "Yko7PKHZNXotIFUBG7I9"
    },
    "james": {
        "voice_id": "ZQe5CZNOzWyzPSCn5a3c"
    },
    "joseph": {
        "voice_id": "Zlb1dXrM653N07WRdFW3"
    },
    "jeremy": {
        "voice_id": "bVMeCyTHy58xNoL34h3p"
    },
    "michael": {
        "voice_id": "flq6f7yk4E4fJM5XTYuZ"
    },
    "ethan": {
        "voice_id": "g5CIjZEefAph4nQFvHAz"
    },
    "gigi": {
        "voice_id": "jBpfuIE2acCO8z3wKNLl"
    },
    "freya": {
        "voice_id": "jsCqWAovK2LkecY7zXl4"
    },
    "grace": {
        "voice_id": "oWAxZDx7w5VEj9dCyTzz"
    },
    "daniel": {
        "voice_id": "onwK4e9ZLuTAKqWW03F9"
    },
    "serena": {
        "voice_id": "pMsXgVXv3BLzUgSXRplE"
    },
    "adam": {
        "voice_id": "pNInz6obpgDQGcFmaJgB"
    },
    "nicole": {
        "voice_id": "piTKgcLEGmPE4e6mEKli"
    },
    "jessie": {
        "voice_id": "t0jbNlBVZ17f02VDIeMI"
    },
    "ryan": {
        "voice_id": "wViXBPUzp2ZZixB1xQuM"
    },
    "sam": {
        "voice_id": "yoZ06aMxZJJ28mfd3POQ"
    },
    "glinda": {
        "voice_id": "z9fAnlkpzviPz146aGWa"
    },
    "giovanni": {
        "voice_id": "zcAOhNBS3c14rBihAFp1"
    },
    "mimi": {
        "voice_id": "zrHiDhphv9ZnVXBqCLjz"
    }
};
const PAULCA_VOICE = 'EcOnXAJ3e2odu7bmr9M9';
const YOUTUBE_VOICE = 'LQj2X4OpUuX9YFC5sCDw';
const MICHAEL_VOICE = 'flq6f7yk4E4fJM5XTYuZ';
const MATTHEW_VOICE = 'Yko7PKHZNXotIFUBG7I9';
const DEFAULT_VOICE = MICHAEL_VOICE;
const DEFAULT_MODEL = 'eleven_multilingual_v2';
const DEFAULT_URL = "https://api.elevenlabs.io";
let apiURL = LABSURL ?? DEFAULT_URL;
let apiKey = LABSKEY;

function init(url = apiURL, key = apiKey) {
    apiURL = url;
    apiKey = key;
    return {
        apiURL,
        apiKey
    };
}
const FORMATS = [
    'mp3_44100_64', 'mp3_44100_96', 'mp3_44100_128', 'mp3_44100_192',
    'pcm_16000', 'pcm_22050', 'pcm_24000', 'pcm_44100'
];
async function apiCall(method, relativeURL, _headers, body) {
    try {
        const headers = {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
            ..._headers
        };
        const options = {
            method: method || "GET",
            headers: headers,
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null
        };
        const response = await fetch(apiURL + relativeURL, options);
        return response;
    } catch (err) {
        throw new Error("apiCall: " + err.message);
    }
}
async function getUser() {
    try {
        const response = await apiCall("GET", "/v1/user", []);
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error("getUser: " + err.message);
    }
    return null;
}
async function getUserInfo() {
    try {
        const response = await apiCall("GET", "/v1/user/subscription");
        return await response.json();
    } catch (err) {
        console.log("getUserInfo: " + err.message);
        throw err;
    }
}
async function isValidVoice(voiceId) {
    try {
        const response = await apiCall("GET", `/v1/voices/${voiceId}`);
        const voice = await response.json();
        return voice.voice_id === voiceId;
    } catch (e) {
        console.log("isValidVoice: " + e.message);
        return false;
    }
}
async function listVoices() {
    try {
        const response = await apiCall("GET", "/v1/voices", []);
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("listVoices: " + err.message);
    }
    return null;
}
async function synthesize(ttsOptions) {
    try {
        const user = await getUser();
        const tierLevel = user?.subscription?.tier || 'free';
        const isMP3 = ttsOptions.output_format.startsWith("mp3_");
        if (tierLevel === 'free' && ttsOptions.output_format === 'mp3_44100_192') {
            console.log("Free tier is limited to mp3_44100_128 format.");
            ttsOptions.output_format = 'mp3_44100_128';
        }
        const acceptType = isMP3 ? 'audio/mpeg' : 'audio/wav';
        const headers = {
            "Accept": acceptType
        };
        const output_format = ttsOptions.output_format;
        const modelMappings = {
            'e1': 'eleven_monolingual_v1',
            'e2': 'eleven_monolingual_v2',
            'm1': 'eleven_multilingual_v1',
            'm2': 'eleven_multilingual_v2',
        };
        const model_id = modelMappings[ttsOptions.model_id] || DEFAULT_MODEL;
        console.log("Using model: " + model_id);
        const requestBody = {
            ...ttsOptions,
            model_id: model_id,
            voice_settings: {
                "stability": 0.75,
                "similarity_boost": 0.75,
                "style": 0.0,
            }
        };
        delete requestBody.output_format;
        const response = await apiCall(
            "POST",
            `/v1/text-to-speech/${ttsOptions?.voice_id}/stream?output_format=${output_format}`,
            headers,
            requestBody
        );
        const contentType = response.headers.get('content-type');
        const responseData = contentType && contentType.includes('application/json') ? await response.json() : await response.arrayBuffer();
        return responseData;
    } catch (err) {
        throw err;
    }
}
export {
    LABSURL,
    LABSKEY,
    FORMATS,
    DEFAULT_VOICE,
    PAULCA_VOICE,
    YOUTUBE_VOICE,
    labsVoiceID,
    init,
    getUser,
    getUserInfo,
    isValidVoice,
    listVoices,
    synthesize,
};
