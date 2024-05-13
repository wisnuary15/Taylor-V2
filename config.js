import fs from "fs"
import chalk from "chalk"
import {
    fileURLToPath
} from "url"

import moment from "moment-timezone"
import colors from "colors"
const {
    WA_DEFAULT_EPHEMERAL
} = (await import('@whiskeysockets/baileys')).default;

async function loadConfig() {
    try {

        /** custom colors for beautiful console.log()  **/
        colors.setTheme({
            main: ['brightBlue', 'bold'],
            silly: 'rainbow',
            input: 'grey',
            verbose: 'cyan',
            prompt: 'grey',
            info: 'green',
            data: 'grey',
            help: 'cyan',
            warn: 'yellow',
            debug: 'blue',
            error: 'brightRed'
        });

        /** Oᴡɴᴇʀ number  **/
        global.owner = [
            ["6282195322106", "️𝑾𝒖𝒅𝒚𝒔𝒐𝒇𝒕 - 𝑶𝒘𝒏𝒆𝒓", true]
        ]
        global.mods = ["6282195322106"]
        global.prems = ["6282195322106"]

        /** Website  **/
        global.APIs = {
            amel: "https://melcanz.com",
            bg: "http://bochil.ddns.net",
            dhnjing: "https://dhnjing.xyz",
            dzx: "https://api.dhamzxploit.my.id",
            fdci: "https://api.fdci.se",
            hardianto: "https://hardianto.xyz",
            lolhuman: "https://api.lolhuman.xyz",
            neoxr: "https://api.neoxr.my.id",
            pencarikode: "https://pencarikode.xyz",
            xteam: "https://api.xteam.xyz",
            xyro: "https://api.xyroinee.xyz",
            zeks: "https://api.zeks.xyz",
            zenz: "https://api.zahwazein.xyz",
            btchx: "https://api.botcahx.biz.id"
        }

        /** Apikey  **/
        global.APIKeys = {
            "https://api.neoxr.my.id": pickRandom(["5VC9rvNx", "lucycat"]),
            "https://api.lolhuman.xyz": pickRandom(["043c5de3b7cd6b1b8f2a0f90", "e1a815979e6adfc071b7eafc", "ed78c137a46873c5b8e5fe3b", "IchanZX", "GataDios"]),
            "https://api.xteam.xyz": "HIRO",
            "https://api.xyroinee.xyz": "yqiBQF86F4",
            "https://api.zeks.xyz": "apivinz",
            "https://hardianto.xyz": "hardianto",
            "https://melcanz.com": "manHkmst",
            "https://pencarikode.xyz": "pais",
            "https://api.zahwazein.xyz": "zenzkey_1ec92f71d3bb",
            "https://api.botcahx.biz.id": "Admin"
        }

        /** Lolhuman  **/
        global.lolkey = pickRandom(["043c5de3b7cd6b1b8f2a0f90", "e1a815979e6adfc071b7eafc", "ed78c137a46873c5b8e5fe3b", "IchanZX", "GataDios"])
        /** XyroineeApi  **/
        global.xyro = "yqiBQF86F4"

        /** Number  **/
        global.nomorbot = "6281779570422"
        global.nomorown = "6282195322106"
        global.namebot = " ᴛᴀyʟᴏʀ-ʙᴏᴛ あ⁩ "
        global.nameown = "「 𝑾𝒖𝒅𝒚𝒔𝒐𝒇𝒕 」"

        /** Random  **/
        global.pmenus = pickRandom(["乂", "◈", "➭", "ଓ", "⟆•", "⳻", "•", "↬", "◈", "⭑", "ᯬ", "◉", "᭻", "»", "〆", "々", "⛥", "✗", "⚜", "⚚", "♪"])
        global.htjava = pickRandom(["乂", "⛶", "❏", "⫹⫺", "☰", "⎔", "✦", "⭔", "⬟", "⛊", "⚝"])

        /** Watermark  **/
        global.wm = "                「 ᴛᴀyʟᴏʀ-ʙᴏᴛ あ⁩ 」"
        global.wm2 = "꒷︶꒷꒥꒷ ‧₊˚ ꒰ฅ˘օառɛʀ˘ฅ ꒱ ‧₊˚꒷︶꒷꒥꒷"
        global.wm3 = htjava + " ᴛᴀyʟᴏʀ-ʙᴏᴛ"

        /** Thumbnail  **/
        global.giflogo = (await VideoGalau())
        global.fla = pickRandom((await ImgLogoFlam()))
        global.flaaa = (await ImgLogoDynamic())

        /** Link  **/
        global.sig = "https://www.instagram.com/wudysoft"
        global.sgh = "https://www.github.com/AyGemuy"
        global.sgc = "https://s.id/Taylor-V2"
        global.sdc = "https://www.discord.com/wudysoft"
        global.snh = "https://www.tiktok.com/@upload_file"
        global.sfb = "https://www.facebook.com/"
        global.syt = "https://www.youtube.com/"

        /** Nsfw  **/
        global.premnsfw = true

        /** Type  **/
        global.dpptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        global.ddocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        global.dxlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        global.dpdf = "application/pdf"
        global.drtf = "text/rtf"

        /** Fake  **/
        global.fsizedoc = SizeDoc()
        global.fpagedoc = PageDoc()

        /** Hiasan  **/
        global.dmenut = htjava + "───『"
        global.dmenub = "│" + pmenus
        global.dmenub2 = "│" + pmenus
        global.dmenuf = "╰──────────⳹"
        global.dashmenu = "☰ *D A S B O A R D* ☰"
        global.htki = htjava + "───『"
        global.htka = "』───" + htjava

        /** Thumbnail  **/
        global.hwaifu = (await ImgWaifu())
        global.hbeach = (await ImgCosplay())
        global.thumbnailUrl = (await ImgBoneka())
        global.hoppai = (await ImgCosplay())
        global.hloli = (await ImgCosplay())
        global.hyuri = (await ImgCosplay())
        global.hneko = (await ImgCosplay())
        global.hLokun = (await ImgCosplay())
        global.hbunny = (await ImgCosplay())
        global.thumbs = (await ImgBoneka())
        global.thumb = pickRandom(["https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2560/1600", (await ImgEstetik())])
        global.imagebot = pickRandom(["https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2560/1600", (await ImgMountain())])
        global.thumbdoc = pickRandom(["https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2560/1600", (await ImgEstetik())])
        global.logo = pickRandom(["https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2560/1600", (await ImgMountain())])

        /** Begin  **/
        global.ucapan = Pagi()
        global.ephemeral = WA_DEFAULT_EPHEMERAL

        /** Global Random  **/
        global.doc = pickRandom(["application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/msword", "application/pdf", "text/rtf"])

        global.knimg = pickRandom(["https://minimalistic-wallpaper.demolab.com/?random", "https://picsum.photos/2560/1600", (await ImgMountain())])

        /** Watermark  **/
        global.lopr = "🅟"
        global.lolm = "Ⓛ"
        global.cmenut = htjava + "───『"
        global.cmenuh = "』───" + htjava
        global.cmenub = "│" + pmenus
        global.cmenuf = "╰──────────⳹"
        global.cmenua = "\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n     "
        global.emojis = pickRandom(["👑", "🎗", "️🗿", "🕹", "️💡", "🪄", "🎈", "🎊", "🔖", "📍", "❤", "‍🔥", "💤", "💭", "🕚", "💬", "🚩", "🎐", "🍃", "🌿", "🥀", "✨", "⚡", "☂️"])
        global.packname = "𝑴𝒂𝒅𝒆 𝒃𝒚"
        global.stickpack = packname
        global.author = "𝑻𝒂𝒚𝒍𝒐𝒓 乂 𝑾𝒖𝒅𝒚𝒔𝒐𝒇𝒕"
        global.stickauth = author + "\nwa.me/" + nomorbot
        global.multiplier = 69

        /** Pesan  **/
        global.eror = "_*`Bot error ❌`*_";
        global.wait = "_*`Please wait ⏳`*_";
        global.render = "_*`Rendering 📍`*_";

        global.webs = "https://s.id/Cerdasin62"
        global.gcwangsaf = "https://chat.whatsapp.com/LqJoQr4IdBLAXsxd1PkNph"

        /** Donasi  **/
        global.saweria = "https://saweria.com/wudysoft"
        global.dana = "0887435373103"
        global.pulsa = "082195322106"
        global.trakteer = "https://trakteer.id/wudysoft"
        global.paypal = "wudysoft@mail.com"
        global.gopay = "082195322106"
        global.pdana = "0887435373103"
        global.povo = "082195322106"
        global.pgopay = "082195322106"
        global.ppulsa = "082195322106"
        global.ppulsa2 = "082195322106"
        global.psaweria = "https://saweria.com/Wudysoft"


        /** Emoji  **/
        global.rpg = {
            emoticon(string) {
                string = string.toLowerCase()
                const emot = {
                    Fox: "🦊",
                    agility: "🤸‍♂️",
                    anggur: "🍇",
                    apel: "🍎",
                    aqua: "🥤",
                    arc: "🏹",
                    armor: "🥼",
                    bank: "🏦",
                    batu: "🧱",
                    berlian: "💎",
                    bibitanggur: "🍇",
                    bibitapel: "🍎",
                    bibitjeruk: "🍊",
                    bibitmangga: "🥭",
                    bibitpisang: "🍌",
                    botol: "🍾",
                    bow: "🏹",
                    bull: "🐃",
                    cat: "🐈",
                    centaur: "🎠",
                    chicken: "🐓",
                    coal: "⚱️",
                    common: "📦",
                    cow: "🐄",
                    crystal: "🔮",
                    darkcrystal: "♠️",
                    diamond: "💎",
                    dog: "🐕",
                    dragon: "🐉",
                    eleksirb: "🧪",
                    elephant: "🐘",
                    emasbatang: "🪙",
                    emasbiasa: "🥇",
                    emerald: "💚",
                    exp: "✉️",
                    fishingrod: "🎣",
                    foodpet: "🍱",
                    fox: "🦊",
                    gardenboc: "🗳️",
                    gardenboxs: "📦",
                    gems: "🍀",
                    giraffe: "🦒",
                    gold: "👑",
                    griffin: "🦒",
                    health: "❤️",
                    healtmonster: "❤‍🔥",
                    horse: "🐎",
                    intelligence: "🧠",
                    iron: "⛓️",
                    jeruk: "🍊",
                    kaleng: "🥫",
                    kardus: "📦",
                    kayu: "🪵",
                    ketake: "💿",
                    keygold: "🔑",
                    keyiron: "🗝️",
                    knife: "🔪",
                    koinexpg: "👛",
                    kucing: "🐈",
                    kuda: "🐎",
                    kyubi: "🦊",
                    legendary: "🗃️",
                    level: "🧬",
                    limit: "🌌",
                    lion: "🦁",
                    magicwand: "⚕️",
                    makanancentaur: "🥗",
                    makanangriffin: "🥙",
                    makanankyubi: "🍗",
                    makanannaga: "🍖",
                    makananpet: "🥩",
                    makananphonix: "🧀",
                    mana: "🪄",
                    mangga: "🥭",
                    money: "💵",
                    mythic: "🗳️",
                    mythic: "🪄",
                    naga: "🐉",
                    pancingan: "🎣",
                    pet: "🎁",
                    petFood: "🍖",
                    phonix: "🦅",
                    pickaxe: "⛏️",
                    pisang: "🍌",
                    pointxp: "📧",
                    potion: "🥤",
                    rock: "🪨",
                    robo: "🤖",
                    rubah: "🦊",
                    sampah: "🗑️",
                    serigala: "🐺",
                    snake: "🐍",
                    stamina: "⚡",
                    strength: "🦹‍♀️",
                    string: "🕸️",
                    superior: "💼",
                    sword: "⚔️",
                    tiger: "🐅",
                    tiketcoin: "🎟️",
                    trash: "🗑",
                    umpan: "🪱",
                    uncommon: "🎁",
                    upgrader: "🧰",
                    wood: "🪵"
                }
                const results = Object.keys(emot).map(v => [v, new RegExp(v, "gi")]).filter(v => v[1].test(string))
                if (!results.length) return ""
                else return emot[results[0][0]]
            }
        }
    } catch (err) {
        console.error(`Error in Load Config: ${err.message}`);
    } finally {
        setTimeout(loadConfig, 30 * 60 * 1000);
    }
}

export {
    loadConfig
}

const file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update config.js"))
    import(`${file}?update=${Date.now()}`)
})

/** Selamat Pagi  **/
function Pagi() {
    const waktunya = moment.tz("Asia/Makassar").format("HH");
    return waktunya >= 24 ? "Selamat Begadang 🗿" :
        waktunya >= 18 ? "Selamat malam 🌙" :
        waktunya >= 15 ? "Selamat sore 🌅" :
        waktunya > 10 ? "Selamat siang ☀️" :
        waktunya >= 4 ? "Selamat pagi 🌄" :
        "Selamat Pagi 🗿";
}

/** Randomizer  **/
function pickRandom(list) {
    const shuffledList = list.slice().sort(() => Math.random() - 0.5);
    return shuffledList[Math.floor(Math.random() * shuffledList.length)];
}

/** Img Array  **/
async function ImgCosplay() {
    const { cosplay } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return cosplay
}

/** Img Array  **/
async function ImgMountain() {
const { mountain } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return pickRandom(mountain)
}

/** Img Dynamic  **/
async function ImgLogoDynamic() {
const { dynamic } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return `https://dynamic.brandcrowd.com/asset/logo/${pickRandom(dynamic)}/logo?v=4&text=`
}

/** Img Flamming  **/
async function ImgLogoFlam() {
const { flamming } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return flamming
}

/** Img Array  **/
async function VideoGalau() {
const { galau } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return `https://telegra.ph/file/${pickRandom(galau)}.mp4`
}

/** Img Array  **/
async function ImgEstetik() {
const { estetik } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return pickRandom(estetik)
}

/** Img Array  **/
async function ImgWaifu() {
const { waifu } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return waifu
}


/** Img Array  **/
async function ImgBoneka() {
const { boneka } = JSON.parse(await fs.readFileSync('./json/image/image.json'))
    return boneka
}

/** Apa Kabar  **/
function Sapa() {
    const Apa = pickRandom(["Apa kabar ", "Halo ", "Hai "])
    return Apa
}

function SizeDoc() {
    return Math.pow(10, 15)
}

function PageDoc() {
    return Math.pow(10, 10)
}

function businessOwnerJid() {
    const Org = pickRandom([global.nomorown, "0", "628561122343", "6288906250517", "6282195322106", "6281119568305", "6281282722861", "6282112790446"])
    const Parti = pickRandom([Org + "@s.whatsapp.net"])
    return Parti;
}