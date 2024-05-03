import Jimp from 'jimp';
import axios from 'axios';
import chalk from 'chalk';
let proxyurl = "https://files.xianqiao.wang/"

class ImageEditor {
    constructor(bgImageURL, avatarURL, avatarX = 55, avatarY = 155, textX = 65, textY = 135) {
        this.bgImageURL = bgImageURL;
        this.avatarURL = avatarURL;
        this.avatarX = avatarX;
        this.avatarY = avatarY;
        this.textX = textX;
        this.textY = textY;
    }

    async asyncWelcome(Name, Text, WL) {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const welcomeFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const welcomeText = 'WELCOME ' + WL;
            const welcomeTextX = Math.floor((735 - Jimp.measureText(welcomeFont, welcomeText)) / 2);
            bgImage.print(welcomeFont, welcomeTextX, 20, welcomeText);

            const textDataWelcome = [{
                    l: 'Name:',
                    v: Name
                },
                {
                    l: 'Additional Info:',
                    v: Text
                },
                {
                    l: 'Introduction:',
                    v: 'Introduce key features and benefits.'
                },
                {
                    l: 'Greetings:',
                    v: 'Warm greetings to our new members.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataWelcome.length * 30) / 2);

            textDataWelcome.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncWelcome', error);
            throw error;
        }
    }

    async asyncLeave(Name, Text, WL) {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const leaveFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const leaveText = 'LEAVE ' + WL;
            const leaveTextX = Math.floor((735 - Jimp.measureText(leaveFont, leaveText)) / 2);
            bgImage.print(leaveFont, leaveTextX, 20, leaveText);

            const textDataLeave = [{
                    l: 'Farewell Message:',
                    v: Name
                },
                {
                    l: 'Final Note:',
                    v: Text
                },
                {
                    l: 'Closure:',
                    v: 'Closing remarks and best wishes.'
                },
                {
                    l: 'Memories Shared:',
                    v: 'Recall fond memories together.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataLeave.length * 30) / 2);

            textDataLeave.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncLeave', error);
            throw error;
        }
    }

    async asyncProfile(Name, Text, WL) {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const profileFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const profileText = 'PROFILE ' + WL;
            const profileTextX = Math.floor((735 - Jimp.measureText(profileFont, profileText)) / 2);
            bgImage.print(profileFont, profileTextX, 20, profileText);

            const textDataProfile = [{
                    l: 'Profile Updated On:',
                    v: Date.now()
                },
                {
                    l: 'Changes Made By:',
                    v: Name
                },
                {
                    l: 'Profile Highlights:',
                    v: Text
                },
                {
                    l: 'Contact Information:',
                    v: 'Updated contact details.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataProfile.length * 30) / 2);

            textDataProfile.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncProfile', error);
            throw error;
        }
    }

    async asyncVerify(Name, Text, WL) {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const verifyFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const verifyText = 'VERIFY ' + WL;
            const verifyTextX = Math.floor((735 - Jimp.measureText(verifyFont, verifyText)) / 2);
            bgImage.print(verifyFont, verifyTextX, 20, verifyText);

            const textDataVerify = [{
                    l: 'Verification Time:',
                    v: Date.now()
                },
                {
                    l: 'Verified By:',
                    v: Name
                },
                {
                    l: 'Verification Steps:',
                    v: Text
                },
                {
                    l: 'Security Check:',
                    v: 'Ensuring user authenticity.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataVerify.length * 30) / 2);

            textDataVerify.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncVerify', error);
            throw error;
        }
    }

    async asyncOtp(Cods, Succ) {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const otpFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const otpText = 'otp TO: NIGGA';
            const otpTextX = Math.floor((735 - Jimp.measureText(otpFont, otpText)) / 2);
            bgImage.print(otpFont, otpTextX, 20, otpText);

            const textDataOtp = [{
                    l: 'OTP:',
                    v: Cods
                },
                {
                    l: 'Verified By:',
                    v: Succ
                },
                {
                    l: 'Authentication:',
                    v: 'Confirming user identity.'
                },
                {
                    l: 'Secure Access:',
                    v: 'Enhancing account security.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataOtp.length * 30) / 2);

            textDataOtp.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncOtp', error);
            throw error;
        }
    }

    async asyncSuccess() {
        try {
            const [bgImage, avatarImage] = await Promise.all([
                axios.get(this.bgImageURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data)),
                axios.get(this.avatarURL, {
                    responseType: 'arraybuffer'
                }).then(res => Jimp.read(res.data))
            ]);

            bgImage.resize(735, 490);
            avatarImage.circle().resize(300, Jimp.AUTO);

            const centerX = this.avatarX || Math.floor((735 - avatarImage.getWidth() - 20) / 2);
            const centerY = this.avatarY || Math.floor((490 - avatarImage.getHeight()) / 2);
            bgImage.composite(avatarImage, centerX, centerY);
            const successFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const successText = 'success TO: NIGGA';
            const successTextX = Math.floor((735 - Jimp.measureText(successFont, successText)) / 2);
            bgImage.print(successFont, successTextX, 20, successText);

            const textDataSuccess = [{
                    l: 'Success Time:',
                    v: '2024-02-01 16:00:00'
                },
                {
                    l: 'Performed By:',
                    v: 'System'
                },
                {
                    l: 'Success Metrics:',
                    v: 'Highlight successful outcomes.'
                },
                {
                    l: 'Next Steps:',
                    v: 'Guidance on what comes next.'
                }
            ];

            const textFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const textStartY = this.textY || Math.floor((490 - textDataSuccess.length * 30) / 2);

            textDataSuccess.forEach(({
                l,
                v
            }, i) => {
                const textY = textStartY + i * 30;
                const labelWidth = Jimp.measureText(textFont, l);
                bgImage.print(textFont, centerX + 320, textY + 2, l, labelWidth, 490 - textY - 10);

                const valueWidth = Jimp.measureText(textFont, v);
                bgImage.print(textFont, centerX + 340 + labelWidth, textY + 2, v, 735 - (centerX + 340 + labelWidth), 490 - textY - 10);
            });

            return await bgImage.getBufferAsync(Jimp.AUTO);
        } catch (error) {
            this.handleError('asyncSuccess', error);
            throw error;
        }
    }

    handleError(funcName, error) {
        console.error(chalk.red(`Error in ${funcName}: ${error.message}`));
    }
}

export {
    ImageEditor
};

function WelcomeLeave(Profile, Name, Text, WL, ack = null) {
    Profile = encodeURIComponent("https://wsrv.nl/?url=" + Profile + "&output=jpg")
    Name = encodeURIComponent(Name)
    Text = encodeURIComponent(Text)
    WL = encodeURIComponent(WL)
    let theme = [
        `https://images.socialsplash.app/51a65190-5ce8-4fc4-a2d3-9ec34972f29d?avatar=${Profile}&name=Ineza+Bont%C3%A9&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Text}&author=${Name}&logo=${encodeURIComponent("https://wsrv.nl/?url=" + thumb + "&output=jpg")}&background=%23000000&text=%23ffffff&secondary-text=%23BBB7B7`,
        `https://images.socialsplash.app/bc2fc596-35e3-46fe-a2ca-3e3dca22d2bc?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1534665482403-a909d0d97c67%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000`,
        `https://images.socialsplash.app/b63538d1-4093-4906-b182-0bad4a0f6a6f?avatar=${Profile}&name=${Name}&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=${WL}&avatar_url=${Profile}&author_name=${Name}&date=${encodeURIComponent(getCurrentTime())}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/f556312a-0ed0-42f3-b6e8-bd01075fdc65?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1560969184-10fe8719e047%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=SaaS+in+Germany%3A+A+Bootstrapper%27s+Survival+Guide&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=${WL}&role=${Text}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/37a29b25-5d98-44ee-9957-3ed02a9e9560?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=Welcome&role=${WL}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/3471bfd7-8510-4b51-98de-1067c76280e8?avatar=${Profile}&name=Dan+Klammer&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F80%2FTwitch_Glitch_Logo_Black.svg%2F512px-Twitch_Glitch_Logo_Black.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=August+5%2C+2021&welcome=Welcome&role=Software+Engineer&content=${WL}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`
    ];
    let result = typeof ack === 'number' && !isNaN(ack) ? (ack ? pickRandom(theme) : theme[ack]) : pickRandom(theme);
    return proxyurl + result;
}

function OTP(Profile, Cods, Succ, ack = null) {
    Profile = encodeURIComponent("https://wsrv.nl/?url=" + Profile + "&output=jpg")
    Cods = encodeURIComponent(Cods)
    Succ = encodeURIComponent(Succ)
    let theme = [
        `https://images.socialsplash.app/51a65190-5ce8-4fc4-a2d3-9ec34972f29d?avatar=${Profile}&name=Ineza+Bont%C3%A9&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Succ}&author=${Cods}&logo=${encodeURIComponent("https://wsrv.nl/?url=" + thumb + "&output=jpg")}&background=%23000000&text=%23ffffff&secondary-text=%23BBB7B7`,
        `https://images.socialsplash.app/bc2fc596-35e3-46fe-a2ca-3e3dca22d2bc?avatar=${Profile}&name=${Cods}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1534665482403-a909d0d97c67%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Succ}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000`,
        `https://images.socialsplash.app/b63538d1-4093-4906-b182-0bad4a0f6a6f?avatar=${Profile}&name=${Cods}&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Succ}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=${encodeURIComponent('Taylor-V2')}&avatar_url=${Profile}&author_name=${Cods}&date=${encodeURIComponent(getCurrentTime())}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/f556312a-0ed0-42f3-b6e8-bd01075fdc65?avatar=${Profile}&name=${Cods}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1560969184-10fe8719e047%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=SaaS+in+Germany%3A+A+Bootstrapper%27s+Survival+Guide&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=${encodeURIComponent('Taylor-V2')}&role=${Succ}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/37a29b25-5d98-44ee-9957-3ed02a9e9560?avatar=${Profile}&name=${Cods}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Succ}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=Welcome&role=${encodeURIComponent('Taylor-V2')}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/3471bfd7-8510-4b51-98de-1067c76280e8?avatar=${Profile}&name=Dan+Klammer&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Succ}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F80%2FTwitch_Glitch_Logo_Black.svg%2F512px-Twitch_Glitch_Logo_Black.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=August+5%2C+2021&welcome=Welcome&role=Software+Engineer&content=${encodeURIComponent('Taylor-V2')}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`
    ];
    let result = typeof ack === 'number' && !isNaN(ack) ? (ack ? pickRandom(theme) : theme[ack]) : pickRandom(theme);
    return proxyurl + result;
}

function ImageCanvas(Profile, Name, Text, ack = null) {
    Profile = encodeURIComponent("https://wsrv.nl/?url=" + Profile + "&output=jpg")
    Name = encodeURIComponent(Name)
    Text = encodeURIComponent(Text)
    let theme = [
        `https://images.socialsplash.app/51a65190-5ce8-4fc4-a2d3-9ec34972f29d?avatar=${Profile}&name=Ineza+Bont%C3%A9&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Text}&author=${Name}&logo=${encodeURIComponent("https://wsrv.nl/?url=" + thumb + "&output=jpg")}&background=%23000000&text=%23ffffff&secondary-text=%23BBB7B7`,
        `https://images.socialsplash.app/bc2fc596-35e3-46fe-a2ca-3e3dca22d2bc?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1534665482403-a909d0d97c67%3Fixlib%3Drb-1.2.1%26ixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000`,
        `https://images.socialsplash.app/b63538d1-4093-4906-b182-0bad4a0f6a6f?avatar=${Profile}&name=${Name}&url=ineza.codes&background=${encodeURIComponent("https://wsrv.nl/?url=" + logo + "&output=jpg")}&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F5dc07c1dc79ed80006b49a00%2F960x0.jpg%3Ffit%3Dscale&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=${encodeURIComponent('Taylor-V2')}&avatar_url=${Profile}&author_name=${Name}&date=${encodeURIComponent(getCurrentTime())}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/f556312a-0ed0-42f3-b6e8-bd01075fdc65?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1560969184-10fe8719e047%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=SaaS+in+Germany%3A+A+Bootstrapper%27s+Survival+Guide&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=${encodeURIComponent('Taylor-V2')}&role=${Text}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/37a29b25-5d98-44ee-9957-3ed02a9e9560?avatar=${Profile}&name=${Name}&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fe%2Fe3%2FDiscord_White_Text_Logo_%25282015-2021%2529.svg%2F2560px-Discord_White_Text_Logo_%25282015-2021%2529.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=${encodeURIComponent(getCurrentTime())}&welcome=Welcome&role=${encodeURIComponent('Taylor-V2')}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`,
        `https://images.socialsplash.app/3471bfd7-8510-4b51-98de-1067c76280e8?avatar=${Profile}&name=Dan+Klammer&url=ineza.codes&background=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1495446815901-a7297e633e8d%3Fixid%3DMnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8%26ixlib%3Drb-1.2.1%26auto%3Dformat%26fit%3Dcrop%26w%3D1170%26q%3D80&title=${Text}&author=By+Jon+Levy&logo=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F80%2FTwitch_Glitch_Logo_Black.svg%2F512px-Twitch_Glitch_Logo_Black.svg.png&upper_logo=https%3A%2F%2Flogoeps.com%2Fwp-content%2Fuploads%2F2013%2F04%2Fnational-breast-cancer-foundation-vector-logo.png&image=https%3A%2F%2Fcampusintifada.com%2Fimg%2Fother%2F76%2Ffuslie-wikipedia.jpg&subtitle=MAKING&avatar_url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1507003211169-0a1dd7228f2d%3Fixlib%3Drb-0.3.5%26q%3D80%26fm%3Djpg%26crop%3Dfaces%26fit%3Dcrop%26h%3D200%26w%3D200%26s%3Da72ca28288878f8404a795f39642a46f&author_name=Monica+Lent&date=August+5%2C+2021&welcome=Welcome&role=Software+Engineer&content=${encodeURIComponent('Taylor-V2')}&background=%230000ff&text=%23000000&secondary-text=%23BBB7B7&primary=%23ff0000&secondary=%23000000`
    ];
    let result = typeof ack === 'number' && !isNaN(ack) ? (ack ? pickRandom(theme) : theme[ack]) : pickRandom(theme);
    return proxyurl + result;
}

function getCurrentTime() {
    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    const now = new Date().toLocaleString('id-ID', options);
    return now;
}

function pickRandom(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return null;
    }

    return array[Math.floor(Math.random() * array.length)];
}

export {
    WelcomeLeave,
    OTP,
    ImageCanvas
}