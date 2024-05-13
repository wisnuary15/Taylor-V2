import fetch from "node-fetch"
import {
    Uploader
} from "./uploader.js"
const upload = new Uploader()
async function RemoveBackground(url, ibbkey) {
    let Response = null;
    let task_id;
    await fetch("https://api.simplified.com/api/v1/growth-tools", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "REMOVE_BACKGROUND",
                image_url: url,
                image_type: "image/jpg",
            }),
        })
        .then((res) => res.json())
        .then((json) => {
            task_id = json.task_id;
        })
        .catch((err) => console.log(err));

    while (true) {
        Response = await (
            await fetch("https://api.simplified.com/api/v1/tasks/" + task_id, {
                method: "GET",
                hostname: "api.simplified.com",
            })
        ).json();
        if (Response.info != "") {
            let IBB = await upload.Imgbb(Response.info.data.url, 600, ibbkey)
            return IBB;
        }
    }
}

export {
    RemoveBackground
}