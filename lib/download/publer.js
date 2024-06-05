import axios from 'axios';
const sendInitialRequest = async (mediaURL) => {
    try {
        const result = await axios({
            method: 'post',
            url: 'https://app.publer.io/hooks/media',
            data: {
                iphone: false,
                url: mediaURL
            }
        });
        return result.data["job_id"];
    } catch (error) {
        console.error('Error sending initial request:', error.message);
        throw new Error('Failed to send initial request');
    }
};
const poolJobStatus = async (jobID, mediaURL) => {
    try {
        console.log("jobid: " + jobID);
        const result = await axios({
            method: 'get',
            url: `https://app.publer.io/api/v1/job_status/${jobID}`
        });
        if (result.data.status === "working") {
            return await new Promise(resolve => {
                setTimeout(async () => {
                    resolve(await poolJobStatus(jobID, mediaURL));
                }, 2000);
            });
        } else {
            return {
                originalURL: mediaURL,
                website: 'instagram',
                caption: result.data.payload[0]?.caption,
                downloadURL: result.data.payload[0]?.path
            };
        }
    } catch (error) {
        console.error('Error polling job status:', error.message);
        throw new Error('Failed to poll job status');
    }
};
const reelsVulture = async (mediaURL) => {
    try {
        const jobId = await sendInitialRequest(mediaURL);
        return await poolJobStatus(jobId, mediaURL);
    } catch (error) {
        console.error('Error in reelsVulture:', error.message);
        throw new Error('Failed to process reelsVulture');
    }
};
export {
    reelsVulture
};
