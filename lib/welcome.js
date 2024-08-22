import Jimp from "jimp";
import axios from "axios";
import fetch from "node-fetch";
import chalk from "chalk";
import {
  readFileSync
} from "fs";
const {
  flamming,
  dynamic,
  estetik
} = JSON.parse(readFileSync("./json/image/image.json"));
const imgSource = ["https://api.btstu.cn/sjbz/api.php?lx=1920x1080", "https://minimalistic-wallpaper.demolab.com/?random", "https://www.loremflickr.com/1920/1080", "https://www.picsum.photos/1920/1080"];
class ImageEditor {
  constructor(bgImageURL, avatarURL, avatarX = 55, avatarY = 155, textX = 65, textY = 135) {
    this.bgImageURL = bgImageURL, this.avatarURL = avatarURL, this.avatarX = avatarX,
      this.avatarY = avatarY, this.textX = textX, this.textY = textY;
  }
  async createImage(Name, Text, WL, title, textData) {
    try {
      const [bgImage, avatarImage] = await Promise.all([fetch(this.bgImageURL).then(res => res.arrayBuffer()).then(data => Jimp.read(Buffer.from(data))).catch(() => axios.get(this.bgImageURL, {
        responseType: "arraybuffer"
      }).then(res => Jimp.read(res.data))), fetch(this.avatarURL).then(res => res.arrayBuffer()).then(data => Jimp.read(Buffer.from(data))).catch(() => axios.get(this.avatarURL, {
        responseType: "arraybuffer"
      }).then(res => Jimp.read(res.data)))]);
      bgImage.resize(735, 490), avatarImage.circle().resize(300, Jimp.AUTO);
      const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2),
        centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
      bgImage.composite(avatarImage, centerX, centerY);
      const font32 = await Jimp.loadFont("./lib/fnt/font32.fnt"),
        titleText = `${title} ${WL}`,
        titleTextX = Math.floor((735 - Jimp.measureText(font32, titleText)) / 2);
      bgImage.print(font32, titleTextX, 20, titleText);
      const font16 = await Jimp.loadFont("./lib/fnt/font16.fnt"),
        textStartY = this.textY || Math.floor((490 - 30 * textData.length) / 2);
      return textData.forEach(({
        l,
        v
      }, i) => {
        const textY = textStartY + 30 * i,
          labelWidth = Jimp.measureText(font16, l);
        bgImage.print(font16, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10),
          bgImage.print(font16, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
      }), await bgImage.getBufferAsync(Jimp.MIME_PNG);
    } catch (error) {
      throw this.handleError("createImage", error), error;
    }
  }
  async asyncWelcome(Name, Text, WL) {
    const textData = [{
      l: "Name:",
      v: Name
    }, {
      l: "Additional Info:",
      v: Text
    }, {
      l: "Introduction:",
      v: "Introduce key features and benefits."
    }, {
      l: "Greetings:",
      v: "Warm greetings to our new members."
    }];
    return await this.createImage(Name, Text, WL, "WELCOME", textData);
  }
  async asyncLeave(Name, Text, WL) {
    const textData = [{
      l: "Farewell Message:",
      v: Name
    }, {
      l: "Final Note:",
      v: Text
    }, {
      l: "Closure:",
      v: "Closing remarks and best wishes."
    }, {
      l: "Memories Shared:",
      v: "Recall fond memories together."
    }];
    return await this.createImage(Name, Text, WL, "LEAVE", textData);
  }
  async asyncProfile(Name, Text, WL) {
    const textData = [{
      l: "Profile Updated On:",
      v: new Date().toLocaleString("id-ID")
    }, {
      l: "Changes Made By:",
      v: Name
    }, {
      l: "Profile Highlights:",
      v: Text
    }, {
      l: "Contact Information:",
      v: "Updated contact details."
    }];
    return await this.createImage(Name, Text, WL, "PROFILE", textData);
  }
  async asyncVerify(Name, Text, WL) {
    const textData = [{
      l: "Verification Time:",
      v: new Date().toLocaleString("id-ID")
    }, {
      l: "Verified By:",
      v: Name
    }, {
      l: "Verification Steps:",
      v: Text
    }, {
      l: "Security Check:",
      v: "Ensuring user authenticity."
    }];
    return await this.createImage(Name, Text, WL, "VERIFY", textData);
  }
  async asyncOtp(Cods, Succ) {
    const textData = [{
      l: "OTP:",
      v: Cods
    }, {
      l: "Verified By:",
      v: Succ
    }, {
      l: "Authentication:",
      v: "Confirming user identity."
    }, {
      l: "Secure Access:",
      v: "Enhancing account security."
    }];
    return await this.createImage(Cods, Succ, "OTP", textData);
  }
  async asyncSuccess() {
    const textData = [{
      l: "Success Time:",
      v: new Date().toLocaleString("id-ID")
    }, {
      l: "Performed By:",
      v: "System"
    }, {
      l: "Success Metrics:",
      v: "Highlight successful outcomes."
    }, {
      l: "Next Steps:",
      v: "Guidance on what comes next."
    }];
    return await this.createImage("System", "Successful Operation", "SUCCESS", textData);
  }
  handleError(funcName, error) {
    console.error(chalk.red(`Error in ${funcName}: ${error.message}`));
  }
}

function pickRandom(array) {
  return Array.isArray(array) && 0 !== array.length ? array[Math.floor(Math.random() * array.length)] : null;
}

function ImgLogoDynamic() {
  return dynamic.map(id => `https://dynamic.brandcrowd.com/asset/logo/${id}/logo?v=4&text=`);
}

function ImgLogoFlam() {
  return flamming.map(id => `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=${id}&doScale=true&scaleWidth=480&scaleHeight=240&fontsize=120&backgroundColor=%23000300&shadowType=2&text=`);
}

function ImgEstetik() {
  return pickRandom(estetik);
}
const apis = {
  welcome: ["https://widipe.com/welcome", "https://widipe.com/welcome2", "https://widipe.com/welcome3", "https://api.erdwpe.com/api/maker/welcome1", `https://some-random-api.com/welcome/img/${Math.floor(7 * Math.random()) + 1}/stars`],
  leave: ["https://widipe.com/goodbye", "https://api.erdwpe.com/api/maker/goodbye1", `https://some-random-api.com/welcome/img/${Math.floor(7 * Math.random()) + 1}/stars`]
};
const defaultProfile = () => pickRandom([ImgEstetik(), ...imgSource]);
const defaultBG = "https://i.imgur.com/qschtOP.jpg";
const defaultUID = "100080302688386";
const fontOptions = Array.from({
  length: 10
}, (_, i) => i + 1);
async function fetchLocation(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual"
    });
    if (response.status >= 300 && response.status < 400) {
      const redirectUrl = response.headers.get("Location");
      if (redirectUrl) return redirectUrl;
    }
    return url;
  } catch (error) {
    console.error("Error fetching location:", error);
    return url;
  }
}

function buildUrl(base, params) {
  return `${base}?${new URLSearchParams(params).toString()}`;
}

function createParams(url, {
  name,
  username,
  gcname,
  count,
  profile,
  uid,
  bg,
  isLeave
}) {
  const commonParams = {
    name: encodeURI(name || "User"),
    username: encodeURI(username || name || "User"),
    avatar: encodeURI(profile || defaultProfile()),
    discriminator: encodeURI(uid || "0000"),
    guildName: encodeURI(gcname || "Group"),
    memberCount: encodeURI(count || 0),
    textcolor: "white",
    key: "CEvvlVQ5nEPMsKx7xjZBEbJxc",
    bg: encodeURI(bg || defaultBG),
    font: encodeURI(pickRandom(fontOptions))
  };
  if (url.includes("widipe.com")) {
    delete commonParams.avatar;
    delete commonParams.username;
    delete commonParams.discriminator;
    delete commonParams.guildName;
    delete commonParams.memberCount;
    delete commonParams.textcolor;
    delete commonParams.key;
    delete commonParams.font;
    return {
      ...commonParams,
      pp: encodeURI(profile || defaultProfile()),
      ppgc: encodeURI(defaultProfile()),
      gcname: encodeURI(gcname || "Group"),
      member: encodeURI(count || 0)
    };
  }
  if (url.includes("api.erdwpe.com")) {
    delete commonParams.avatar;
    delete commonParams.username;
    delete commonParams.discriminator;
    delete commonParams.guildName;
    delete commonParams.memberCount;
    delete commonParams.textcolor;
    delete commonParams.key;
    delete commonParams.font;
    return {
      ...commonParams,
      member: encodeURI(count || 0),
      pp: encodeURIComponent(profile || defaultProfile()),
      bg: encodeURIComponent(bg || defaultBG),
      gpname: encodeURI(gcname || "Group")
    };
  }
  if (url.includes("some-random-api")) {
    return {
      ...commonParams,
      name: encodeURIComponent(name || "User"),
      username: encodeURIComponent(username || name || "User"),
      avatar: encodeURIComponent(profile || defaultProfile()),
      discriminator: encodeURIComponent("#" + uid || "0000"),
      guildName: encodeURIComponent(gcname || "Group"),
      bg: encodeURIComponent(bg || defaultBG),
      font: encodeURIComponent(pickRandom(fontOptions)),
      uid: uid || defaultUID,
      type: encodeURIComponent(isLeave ? "leave" : "join")
    };
  }
  return commonParams;
}
async function generateUrl(apiType, index, Profile, Name, GC, Count, Text, WL, uid, bg) {
  const urls = apis[apiType];
  const url = index !== undefined && index >= 0 && index < urls.length ? urls[index] : pickRandom(urls);
  let profileUrl = Profile || defaultProfile();
  let bgUrl = bg || defaultBG;
  if (url.includes("some-random-api")) {
    profileUrl = await fetchLocation(profileUrl);
    bgUrl = await fetchLocation(bgUrl);
  }
  const locationUrl = await fetchLocation(url);
  const params = createParams(locationUrl, {
    name: Name,
    username: Name,
    gcname: GC,
    count: Count,
    profile: profileUrl,
    uid: uid,
    bg: bgUrl,
    isLeave: apiType === "leave"
  });
  const finalUrl = buildUrl(locationUrl, params);
  const decodedParams = Object.fromEntries(new URLSearchParams(finalUrl.split("?")[1]).entries());
  return {
    finalUrl: decodeURIComponent(finalUrl),
    decodedParams: Object.fromEntries(Object.entries(decodedParams).map(([key, value]) => [key, decodeURIComponent(value)]))
  };
}
const Welcome = async (Profile, Name, GC, Count, Text, WL, uid, bg, index) => await generateUrl("welcome", index, Profile, Name, GC, Count, Text, WL, uid, bg);
const Leave = async (Profile, Name, GC, Count, Text, WL, uid, bg, index) => await generateUrl("leave", index, Profile, Name, GC, Count, Text, WL, uid, bg);

function BannerBot(Text) {
  Text = encodeURI(Text);
  const themes = [`${pickRandom(ImgLogoFlam())}${Text}`, `${pickRandom(ImgLogoDynamic())}${Text}`];
  return pickRandom(themes);
}

function OTP(Cods) {
  return pickRandom([`https://dummyimage.com/300.png/09f/fff&text=${Cods = encodeURI(Cods)}`, `https://via.placeholder.com/300/fff?text=${Cods}`, `https://fakeimg.pl/300x300/ffffff/000000/?text=${Cods}`, `https://api.sylvain.pro/en/captcha?text=${Cods}`]);
}
export {
  ImageEditor,
  Welcome,
  Leave,
  OTP,
  BannerBot
};