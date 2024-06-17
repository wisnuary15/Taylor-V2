import axios from "axios";
export const defaultParams = {
  model: "auto",
  steps: 30,
  cfg: 6,
  sampler: "Euler a",
  negative_prompt: "(bad_prompt:0.8), multiple persons, multiple views, extra hands, ugly, lowres, bad quality, blurry, disfigured, extra limbs, missing limbs, deep fried, cheap art, missing fingers, out of frame, cropped, bad art, face hidden, text, speech bubble, stretched, bad hands, error, extra digit, fewer digits, worst quality, low quality, normal quality, mutated, mutation, deformed, severed, dismembered, corpse, pubic, poorly drawn, (((deformed hands))), (((more than two hands))), (((deformed body))), ((((mutant))))', ",
  quantity: 1
};
export const app_base = "https://app.prodia.com";
export const api_base = "http://api.prodia.com";
export const cloud_base = "https://images.prodia.xyz";
export const host_base = "api.prodia.com";
export const wait = async ms => {
  await new Promise((resolve => setTimeout(resolve, ms)));
};
export const sliceQuotes = str => "'" === str.charAt(0) && "'" === str.charAt(str.length - 1) ? str.slice(1, -1) : str;
export const generateReq = async ({ prompt: prompt, model: model, negative_prompt: negative_prompt = defaultParams.negative_prompt, steps: steps = defaultParams.steps, cfg: cfg = defaultParams.cfg, seed: seed = Math.floor(1e6 * Math.random()), sampler: sampler = defaultParams.sampler } = {}) => {
  const params = {
    prompt: prompt,
    model: model,
    negative_prompt: negative_prompt,
    steps: steps,
    cfg: cfg,
    seed: seed,
    sampler: sampler,
    aspect_ratio: "square"
  };
  return (await axios.get(`${api_base}/generate`, {
    params: params,
    headers: {
      Referer: `${app_base}`,
      Host: `${host_base}`
    },
    timeout: 3e5
  }, params)).data;
};
export const jobReq = async job => (await axios.get(`${api_base}/job/${job}`)).data;
export const imageReq = async job => await axios.get(`${cloud_base}/${job}.png?download=1`, {
  responseType: "arraybuffer"
});
export const req = {
  generate: generateReq,
  job: jobReq,
  image: imageReq
};
export const getModels = async select => {
  const jsPath = (await axios.get(`${app_base}`)).data.match(/<script defer="defer" src="(\/js\/app\.[a-f\d]+\.js)"><\/script>/)[1],
    modelsString = (await axios.get(`${app_base}${jsPath}`)).data.match(/VUE_APP_AI_MODELS:'(.*?)',VUE_APP_STATS_STREAMS/)[1].replaceAll("\\", "");
  return JSON.parse(modelsString);
};
export const draw = async options => {
  const { modelIds: modelIds, model: model, quantity: quantity = 1, comp: comp } = options;
  model && "auto" !== model || (options.model = modelIds.find((modelId => modelId.startsWith("anything-v4.5"))));
  const images = [],
    length = comp ? quantity * modelIds.length : quantity,
    promises = Array.from({
      length: length
    }, (async (_, i) => {
      comp && (options.model = modelIds[i % modelIds.length]);
      const jobInfo = await req.generate(options),
        { job: job } = jobInfo;
      var status, statusCheck = 20;
      do {
        await wait(3e3);
        const statusInfo = await req.job(job);
        ({ status: status } = statusInfo), statusCheck--;
      } while ("succeeded" !== status && statusCheck > 0);
      if ("succeeded" !== status) return "Status check timeout";
      const imageData = await req.image(job),
        { data: data } = imageData;
      var image = {};
      image.buffer = Buffer.from(data, "binary"), (image = {
          ...image,
          ...jobInfo
        }).params.model = image.params.options.sd_model_checkpoint, delete image.params.options.sd_model_checkpoint,
        delete image.status, images.push(image);
    }));
  return await Promise.all(promises), images;
};
export const generate = async (params, models = "") => {
  models || (models = await getModels());
  const modelIds = Object.values(models);
  return await draw({
    modelIds: modelIds,
    ...params
  });
};