import axios from "axios";
const sendInitialRequest = async mediaURL => {
  try {
    return (await axios({
      method: "post",
      url: "https://app.publer.io/hooks/media",
      data: {
        iphone: !1,
        url: mediaURL
      }
    })).data.job_id;
  } catch (error) {
    throw console.error("Error sending initial request:", error.message), new Error("Failed to send initial request");
  }
}, poolJobStatus = async (jobID, mediaURL) => {
  try {
    console.log("jobid: " + jobID);
    const result = await axios({
      method: "get",
      url: `https://app.publer.io/api/v1/job_status/${jobID}`
    });
    return "working" === result.data.status ? await new Promise(resolve => {
      setTimeout(async () => {
        resolve(await poolJobStatus(jobID, mediaURL));
      }, 2e3);
    }) : {
      originalURL: mediaURL,
      website: "instagram",
      caption: result.data.payload[0]?.caption,
      downloadURL: result.data.payload[0]?.path
    };
  } catch (error) {
    throw console.error("Error polling job status:", error.message), new Error("Failed to poll job status");
  }
}, reelsVulture = async mediaURL => {
  try {
    const jobId = await sendInitialRequest(mediaURL);
    return await poolJobStatus(jobId, mediaURL);
  } catch (error) {
    throw console.error("Error in reelsVulture:", error.message), new Error("Failed to process reelsVulture");
  }
};
export {
  reelsVulture
};