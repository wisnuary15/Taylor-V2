import axios from "axios";
import cheerio from "cheerio";
async function ytshort(Url, type = "mp4") {
  let {
    data: html
  } = await axios.post("https://ytdownloadid.herokuapp.com/download", {
    "choices-single-default": "mp4" === format ? "Mp4 / Video" : "Mp3 / Audio",
    url: Url
  });
  return cheerio.load(html)("div.s003 > div.first-wrap > button").attr("onclick").split(" = ")[1].replace(/[\"]/g, "");
}
export {
  ytshort
};