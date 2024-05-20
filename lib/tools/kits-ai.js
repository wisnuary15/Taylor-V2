import {
    FormData,
    Blob
} from 'formdata-node';
import {
    fileTypeFromBuffer
} from 'file-type';
import {
    fetch
} from 'undici';
import crypto from 'crypto';

class VoiceAPI {
    async createVoice(voiceModelId, inputBuffer) {
        try {
            const formdata = new FormData();
            const {
                ext,
                mime
            } = await fileTypeFromBuffer(inputBuffer) || {};
            const randomBytes = crypto.randomBytes(5).toString("hex");
            formdata.append("soundFile", new Blob([inputBuffer], {
                type: mime
            }), randomBytes + "." + ext);
            formdata.append("voiceModelId", voiceModelId || "221129");

            const response = await fetch('https://relikt-sweng465.vercel.app/api/voice/create_vtv', {
                method: 'POST',
                body: formdata
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in createVoice:', error);
            throw error;
        }
    }

    async getModelData(type) {
        let voices = [];
        if (type === "eleven") {
            try {
                const response = await fetch("https://api.elevenlabs.io/v1/voices");
                const data = await response.json();
                voices = data.voices;
                return voices
                    .map((voice) => {
                        return {
                            label: voice.name,
                            value: voice.voice_id,
                        };
                    })
                    .sort((a, b) => a.label.localeCompare(b.label));
            } catch (error) {
                console.error('Error in modelVoice:', error);
                throw error;
            }
        } else if (type === "kits") {
            try {
                const response = await fetch("https://relikt-sweng465.vercel.app/api/voice/get_vtv_models");
                const data = await response.json();
                voices = data.data;
                return voices
                    .map((voice) => {
                        return {
                            label: voice.title,
                            value: voice.id,
                        };
                    })
                    .sort((a, b) => a.label.localeCompare(b.label));
            } catch (error) {
                console.error('Error in modelVoice:', error);
                throw error;
            }
        }
    }

    async createTTS(voiceId, textToConvert) {
        try {
            const response = await fetch('https://relikt-sweng465.vercel.app/api/voice/create_tts', {
                method: 'POST',
                body: new URLSearchParams({
                    "textToConvert": textToConvert || "Hello",
                    "voiceId": voiceId || "CYw3kZ02Hs0563khs1Fj"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in createTTS:', error);
            throw error;
        }
    }

}

export {
    VoiceAPI
};