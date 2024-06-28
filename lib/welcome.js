import Jimp from "jimp";
import axios from "axios";
import chalk from "chalk";
import {
  readFileSync
} from "fs";
const {
  flamming,
  dynamic,
  estetik
} = JSON.parse(readFileSync("./json/image/image.json"));
const imgSource = ["https://api.btstu.cn/sjbz/api.php?lx=1920x1080", "https://api.yimian.xyz/img?size=1920x1080", "https://img.xjh.me/random_img.php?type=bg&ctype=acg&return=302&device=web", "https://minimalistic-wallpaper.demolab.com/?random", "https://www.loremflickr.com/1920/1080", "https://www.picsum.photos/1920/1080", "https://www.placebear.com/1920/1080", "https://www.placebeard.it/1920/1080"];

class ImageEditor {
  constructor(bgImageURL, avatarURL, avatarX = 55, avatarY = 155, textX = 65, textY = 135) {
    this.bgImageURL = bgImageURL, this.avatarURL = avatarURL, this.avatarX = avatarX,
      this.avatarY = avatarY, this.textX = textX, this.textY = textY;
  }
  async createImage(Name, Text, WL, title, textData) {
    try {
      const [bgImage, avatarImage] = await Promise.all([axios.get(this.bgImageURL, {
        responseType: "arraybuffer"
      }).then(res => Jimp.read(res.data)), axios.get(this.avatarURL, {
        responseType: "arraybuffer"
      }).then(res => Jimp.read(res.data))]);
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

function generateUrl(type, params) {
  let url = pickRandom({
    welcome: [`https://some-random-api.com/welcome/img/${Math.floor(7 * Math.random()) + 1}/stars`, "https://api.erdwpe.com/api/maker/welcome1"],
    leave: ["https://api.erdwpe.com/api/maker/goodbye1"]
  } [type]);
  if (url.includes("some-random-api.com")) {
    delete params.name;
  }
  if (url.includes("api.erdwpe.com")) {
    delete params.username;
  }
  return `${url}?${new URLSearchParams(params).toString()}`;
}

function Welcome(Profile, Name, GC, Count, Text, WL) {
  Profile = Profile || pickRandom([ImgEstetik(), ...imgSource]);
  return generateUrl("welcome", {
    name: encodeURIComponent(Name || "User"),
    username: encodeURIComponent(Name || "User"),
    guildName: encodeURIComponent(GC || "Group"),
    memberCount: encodeURIComponent(Count || 0),
    avatar: encodeURIComponent(Profile),
    textcolor: "white",
    key: "CEvvlVQ5nEPMsKx7xjZBEbJxc"
  });
}

function Leave(Profile, Name, GC, Count, Text, WL) {
  Profile = Profile || pickRandom([ImgEstetik(), ...imgSource]);
  return generateUrl("leave", {
    name: encodeURIComponent(Name || "User"),
    username: encodeURIComponent(Name || "User"),
    gpname: encodeURIComponent(GC || "Group"),
    member: encodeURIComponent(Count || 0),
    pp: encodeURIComponent(Profile),
    bg: encodeURIComponent(pickRandom([ImgEstetik(), ...imgSource]))
  });
}

function BannerBot(Text) {
  Text = encodeURIComponent(Text);
  const themes = [`${pickRandom(ImgLogoFlam())}${Text}`, `${pickRandom(ImgLogoDynamic())}${Text}`];
  return pickRandom(themes);
}

function OTP(Cods) {
  return pickRandom([`https://dummyimage.com/300.png/09f/fff&text=${Cods = encodeURIComponent(Cods)}`, `https://via.placeholder.com/300/fff?text=${Cods}`, `https://fakeimg.pl/300x300/ffffff/000000/?text=${Cods}`, `https://api.sylvain.pro/en/captcha?text=${Cods}`]);
}
export {
  ImageEditor,
  Welcome,
  Leave,
  OTP,
  BannerBot
};