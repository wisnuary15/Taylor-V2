import axios from 'axios';
import crypto from 'crypto';
export async function before(m) {
    const chat = db.data.chats[m.chat];
    this.talkai = this.talkai || {
        type: 'chat'
    };
    if (m.isBaileys || !m.text || !chat.autoAi) return false;
    const text = m.text;
    try {
        if (chat.autoAi) {
            if (chat.autoAi && text?.split(' ')[0] === 'talkaitype') {
                const requestedType = text?.split(' ')[1];
                if (requestedType === 'chat' || requestedType === 'image') {
                    this.talkai.type = requestedType;
                    this.reply(m.chat, 'Tipe berhasil di set: ' + requestedType, m);
                    return;
                } else {
                    this.reply(m.chat, 'Tipe yang tersedia: chat, image', m);
                    return;
                }
            }
            if (!(text?.split(' ')[0] === 'talkaitype')) {
                const openAIResponse = await TalkAI(this.talkai.type, text);
                if (openAIResponse) {
                    if (this.talkai.type === 'image') {
                        const result = openAIResponse;
                        this.reply(m.chat, result.data[0]?.url, m);
                    } else if (this.talkai.type === 'chat') {
                        const result = openAIResponse;
                        const anu = (result.split('\n')
                            ?.filter(line => line.trim().startsWith('data: '))
                            ?.map(line => line.replace(/data: |\n/g, ''))
                            .join('')
                            .replace(/\\n/g, '\n')) || '';
                        this.reply(m.chat, anu, m);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        this.reply(m.chat, 'Error occurred.', m);
    }
}
export const disabled = false;

function userAgent() {
    const androidVersions = ['4.0.3', '4.1.1', '4.2.2', '4.3', '4.4', '5.0.2', '5.1', '6.0', '7.0', '8.0', '9.0', '10.0', '11.0'];
    const deviceModels = ['M2004J19C', 'S2020X3', 'Xiaomi4S', 'RedmiNote9', 'SamsungS21', 'GooglePixel5'];
    const buildVersions = ['RP1A.200720.011', 'RP1A.210505.003', 'RP1A.210812.016', 'QKQ1.200114.002', 'RQ2A.210505.003'];
    const selectedModel = deviceModels[Math.floor(Math.random() * deviceModels.length)];
    const selectedBuild = buildVersions[Math.floor(Math.random() * buildVersions.length)];
    const chromeVersion = `Chrome/${Math.floor(Math.random() * 80) + 1}.${Math.floor(Math.random() * 999) + 1}.${Math.floor(Math.random() * 9999) + 1}`;
    return `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
}
async function TalkAI(type, message) {
    try {
        const headers = {
            'User-Agent': userAgent(),
            'Referer': 'https://talkai.info/id/chat/',
            'X-Forwarded-For': crypto.randomBytes(4).join('.'),
        };
        const data = {
            temperature: 0.5,
            frequency_penalty: 0,
            type,
            messagesHistory: [{
                from: 'chatGPT',
                content: 'Anda asisten AI, harap menggunakan bahasa Indonesia.'
            }, {
                from: 'you',
                content: message
            }],
            message,
        };
        const response = await axios.post('https://talkai.info/id/chat/send/', data, {
            headers
        });
        return response.data || (await axios.post('https://talkai.info/id/chat/send2/', data, {
            headers
        })).data;
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        throw new Error('Error occurred in TalkAI');
    }
}
