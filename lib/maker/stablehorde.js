import fetch from 'node-fetch';
import chalk from 'chalk';
class StableHorde {
    constructor({
        apiKey = ''
    }) {
        this.apiKey = apiKey || "0000000000";
        this.pendingTextGenerationIds = [];
        this.pendingImageGenerationIds = [];
        this.startTime = 0;
    }
    async fetchData(url, options) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(chalk.red.bold("An error occurred:"), error);
            return error;
        }
    }
    async statusGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/status/${id}`, {
            method: "GET"
        });
    }
    async cancelGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/status/${id}`, {
            method: "DELETE"
        });
    }
    async checkGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/check/${id}`, {
            method: "GET"
        });
    }
    async getModels() {
        return await this.fetchData("https://stablehorde.net/api/v2/status/models", {
            method: "GET"
        });
    }
    async getStyle() {
        return await this.fetchData("https://raw.githubusercontent.com/db0/Stable-Horde-Styles/main/styles.json", {
            method: "GET"
        });
    }
    async imageModels() {
        return await this.fetchData('https://stablehorde.net/api/v2/status/models');
    }
    async textModels() {
        return [
            "koboldcpp/MythoMax-L2-13b",
            "aphrodite/Undi95/Emerhyst-20B",
            "aphrodite/Undi95/MXLewd-L2-20B",
            "aphrodite/Undi95/PsyMedRP-v1-20B",
            "koboldcpp/Emerhyst-20B.q6_k",
        ];
    }
    async generateText(dataInput) {
        const headers = {
            "Content-Type": "application/json",
            "apikey": this.apiKey,
        };
        const body = JSON.stringify({
            prompt: dataInput.prompt + (dataInput.negativePrompt ? ` ### ${dataInput.negativePrompt}` : ""),
            params: {
                ...dataInput
            },
            models: [dataInput.model]
        });
        const response = await fetch("https://stablehorde.net/api/v2/generate/text/async", {
                method: "POST",
                headers,
                body
            })
            .catch(error => {
                console.log(chalk.red.bold("An error occurred:"), error);
            });
        if (response.status === 401) {
            console.log(chalk.yellow("Unauthorized access:"), response);
            return null;
        }
        const {
            id
        } = await response.json();
        this.pendingTextGenerationIds.push(id);
        this.startTime = Date.now();
        const timeout = 120000;
        while (this.pendingTextGenerationIds.length > 0) {
            if (Date.now() - this.startTime > timeout) {
                console.log(chalk.yellow("Text generation timeout."));
                break;
            }
            const checkData = await this.fetchData(`https://stablehorde.net/api/v2/generate/text/status/${id}`, {
                headers
            });
            if (checkData.finished) {
                this.pendingTextGenerationIds.shift();
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        const statusData = await this.fetchData(`https://stablehorde.net/api/v2/generate/text/status/${id}`, {
            headers
        });
        return statusData;
    }
    async generateImage(dataInput) {
        const headers = {
            "apikey": this.apiKey,
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            prompt: dataInput.prompt + (dataInput.negativePrompt ? ` ### ${dataInput.negativePrompt}` : ""),
            params: {
                ...dataInput,
                seed_variation: 1000,
                post_processing: [],
                sampler_name: "k_euler",
                n: 1
            },
            nsfw: dataInput.nsfw,
            censor_nsfw: !dataInput.nsfw,
            slow_workers: true,
            worker_blacklist: false,
            models: [dataInput.model],
            r2: true,
            shared: false
        });
        const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
            method: 'POST',
            headers,
            body
        });
        const {
            id
        } = await response.json();
        this.pendingImageGenerationIds.push(id);
        this.startTime = Date.now();
        const timeout = 120000;
        while (this.pendingImageGenerationIds.length > 0) {
            if (Date.now() - this.startTime > timeout) {
                console.log(chalk.yellow("Image generation timeout."));
                break;
            }
            const pollData = await this.fetchData(`https://stablehorde.net/api/v2/generate/check/${id}`, {
                headers
            });
            if (pollData.done) {
                this.pendingImageGenerationIds.shift();
                const imageResponseData = await this.fetchData(`https://stablehorde.net/api/v2/generate/status/${id}`, {
                    headers
                });
                return imageResponseData;
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}
class AiHorde {
    constructor({
        apiKey = ''
    }) {
        this.apiKey = apiKey || "0000000000";
        this.pendingTextGenerationIds = [];
        this.pendingImageGenerationIds = [];
        this.startTime = 0;
    }
    async fetchData(url, options) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(chalk.red.bold("An error occurred:"), error);
            return error;
        }
    }
    async statusGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/status/${id}`, {
            method: "GET"
        });
    }
    async cancelGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/status/${id}`, {
            method: "DELETE"
        });
    }
    async checkGenerate(id) {
        return await this.fetchData(`https://aihorde.net/api/v2/generate/check/${id}`, {
            method: "GET"
        });
    }
    async getModels() {
        return await this.fetchData("https://aihorde.net/api/v2/status/models", {
            method: "GET"
        });
    }
    async getStyle() {
        return await this.fetchData("https://raw.githubusercontent.com/db0/Stable-Horde-Styles/main/styles.json", {
            method: "GET"
        });
    }
    async imageModels() {
        return await this.fetchData('https://aihorde.net/api/v2/status/models');
    }
    async textModels() {
        return [
            "koboldcpp/MythoMax-L2-13b",
            "aphrodite/Undi95/Emerhyst-20B",
            "aphrodite/Undi95/MXLewd-L2-20B",
            "aphrodite/Undi95/PsyMedRP-v1-20B",
            "koboldcpp/Emerhyst-20B.q6_k",
        ];
    }
    async generateText(dataInput) {
        const headers = {
            "Content-Type": "application/json",
            "apikey": this.apiKey,
        };
        const body = JSON.stringify({
            prompt: dataInput.prompt + (dataInput.negativePrompt ? ` ### ${dataInput.negativePrompt}` : ""),
            params: {
                ...dataInput
            },
            models: [dataInput.model]
        });
        const response = await fetch("https://aihorde.net/api/v2/generate/text/async", {
                method: "POST",
                headers,
                body
            })
            .catch(error => {
                console.log(chalk.red.bold("An error occurred:"), error);
            });
        if (response.status === 401) {
            console.log(chalk.yellow("Unauthorized access:"), response);
            return null;
        }
        const {
            id
        } = await response.json();
        this.pendingTextGenerationIds.push(id);
        this.startTime = Date.now();
        const timeout = 120000;
        while (this.pendingTextGenerationIds.length > 0) {
            if (Date.now() - this.startTime > timeout) {
                console.log(chalk.yellow("Text generation timeout."));
                break;
            }
            const checkData = await this.fetchData(`https://aihorde.net/api/v2/generate/text/status/${id}`, {
                headers
            });
            if (checkData.finished) {
                this.pendingTextGenerationIds.shift();
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        const statusData = await this.fetchData(`https://aihorde.net/api/v2/generate/text/status/${id}`, {
            headers
        });
        return statusData;
    }
    async generateImage(dataInput) {
        const headers = {
            "apikey": this.apiKey,
            "Content-Type": "application/json",
        };
        const body = JSON.stringify({
            prompt: dataInput.prompt + (dataInput.negativePrompt ? ` ### ${dataInput.negativePrompt}` : ""),
            params: {
                ...dataInput,
                seed_variation: 1000,
                post_processing: [],
                sampler_name: "k_euler",
                n: 1
            },
            nsfw: dataInput.nsfw,
            censor_nsfw: !dataInput.nsfw,
            slow_workers: true,
            worker_blacklist: false,
            models: [dataInput.model],
            r2: true,
            shared: false
        });
        const response = await fetch('https://aihorde.net/api/v2/generate/async', {
            method: 'POST',
            headers,
            body
        });
        const {
            id
        } = await response.json();
        this.pendingImageGenerationIds.push(id);
        this.startTime = Date.now();
        const timeout = 120000;
        while (this.pendingImageGenerationIds.length > 0) {
            if (Date.now() - this.startTime > timeout) {
                console.log(chalk.yellow("Image generation timeout."));
                break;
            }
            const pollData = await this.fetchData(`https://aihorde.net/api/v2/generate/check/${id}`, {
                headers
            });
            if (pollData.done) {
                this.pendingImageGenerationIds.shift();
                const imageResponseData = await this.fetchData(`https://aihorde.net/api/v2/generate/status/${id}`, {
                    headers
                });
                return imageResponseData;
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}
export {
    StableHorde,
    AiHorde
};
