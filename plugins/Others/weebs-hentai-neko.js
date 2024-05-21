//   •-- MADE & HELP BY --•
//   | Letta - Sama & Papah-Chan ! 💗🐰
//   •-------------•
// CREDITS ! JANGAN DIUBAH, JANGAN DIHAPUS !!
// Note: Ubah Apikey Di Config.js

//------ FUNCTION & MODULE
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
import fetch from 'node-fetch'
//---------------------------------
let handler = async (m, {
    conn,
    command,
    args,
    usedPrefix,
    DevMode
}) => {

    // ------- OTHER ------
    if (global.db.data.chats[m.chat].nsfw == false && m.isGroup) return conn.reply(m.chat, '❗ ᴏᴘᴛɪᴏɴs ɴsғᴡ ᴅɪᴄʜᴀᴛ ɪɴɪ ʙᴇʟᴜᴍ ᴅɪɴʏᴀʟᴀᴋᴀɴ ᴏʟᴇʜ ᴀᴅᴍɪɴ ɢʀᴏᴜᴘ', m)

    let type = (args[0] || '').toLowerCase()
    let _type = (args[0] || '').toLowerCase()
    let ch = global.db.data.chats[m.chat].premnsfw
    //--------------------------

    //---------------------SOURCE

    //> Default
    let res = `https://api.lolhuman.xyz/api/random/nsfw/`
    let api = `?apikey=${global.lolkey}`

    //> Lolhuman
    let resl = `https://api.lolhuman.xyz/api/random2/`
    let apil = `?apikey=${global.lolkey}`

    //> Xteam
    let xres = `https://api.xteam.xyz/randomimage/`
    let xapi = `?APIKEY=NezukoTachibana281207`
    //--------------------------------

    // ••••••••••••••••• OPTIONS •••••••••••

    // > Example :
    // OPTIONS
    // • false = Free
    // • true = premium

    //+- Contoh: -+
    // let nsfww = (ch == true ? false : <Options, pilih true atau false>)

    //### *FREE* ###
    // let nsfww = (ch == true ? false : false)

    //### *PREM* ###
    // let nsfww = (ch == true ? false : true)

    let ahegao = (ch == true ? false : false)
    let anal = (ch == true ? false : false)
    let ass = (ch == true ? false : true)
    let blowjob = (ch == true ? false : true)
    let cums = (ch == true ? false : true)
    let ecchi = (ch == true ? false : true)
    let ero = (ch == true ? false : false)
    let erofeet = (ch == true ? false : false)
    let erogirl = (ch == true ? false : false)
    let holoero = (ch == true ? false : false)
    let erokitsune = (ch == true ? false : false)
    let eroneko = (ch == true ? false : false)
    let eroyuri = (ch == true ? false : true)
    let feet = (ch == true ? false : true)
    let femdom = (ch == true ? false : true)
    let futanari = (ch == true ? false : true)
    let girlsolo = (ch == true ? false : true)
    let hentai = (ch == true ? false : true)
    let holo = (ch == true ? false : false)
    let jahy = (ch == true ? false : true)
    let kitsune = (ch == true ? false : true)
    let kuni = (ch == true ? false : true)
    let loli = (ch == true ? false : true)
    let manga = (ch == true ? false : true)
    let milf = (ch == true ? false : false)
    let mstrb = (ch == true ? false : false)
    let neko = (ch == true ? false : false)
    let panties = (ch == true ? false : false)
    let pussy = (ch == true ? false : true)
    let oppai = (ch == true ? false : true)
    let spank = (ch == true ? false : true)
    let tentacles = (ch == true ? false : false)
    let thighs = (ch == true ? false : false)
    let tits = (ch == true ? false : true)
    let trap = (ch == true ? false : true)
    let uniform = (ch == true ? false : false)
    let waifu = (ch == true ? false : true)
    let yaoi = (ch == true ? false : true)
    let yuri = (ch == true ? false : true)
    //-------------------------------------

    //---------- TEXT -----------
    let next = 'ɴ ᴇ x ᴛ'
    let fot = botdate
    let txtprem = '❗ ɴsғᴡ ɪɴɪ ᴋʜᴜsᴜs ᴜsᴇʀ ᴘʀᴇᴍɪᴜᴍ\nʜᴀʀᴀᴘ ʜᴜʙᴜɴɢɪ ᴏᴡɴᴇʀ ᴜɴᴛᴜᴋ ᴍᴇᴍʙᴇʟɪ ᴘʀᴇᴍɪᴜᴍ ! 📞'
    let p = '🅟 | '
    let f = 'Ⓕ | '

    let tekk = `\`\`\`➩ Random Image Nsfw ${args[0] ? args[0].capitalize() : false}\`\`\` `
    let teks = `┊ 📮 Silahkan Pilih Dibawah!
┊› Atau ketik ${usedPrefix}nsfw neko
❏──···––`
    //---------------------------

    //--------- BUTTON SELECTIONS ----------
    const sections = [{
        title: `${htki} N S F W ${htka}`,
        rows: [{
                title: `${ ahegao == true ? p : f}` + "A • Ahegao",
                id: ".nsfw ahegao"
            },
            {
                title: `${ anal == true ? p:f}` + "A • Anal",
                id: ".nsfw anal"
            },
            {
                title: `${ ass == true ? p:f}` + "A • Ass",
                id: ".nsfw ass"
            },
            {
                title: `${ blowjob == true ? p:f}` + "B • BlowJob",
                id: ".nsfw blowjob"
            },
            {
                title: `${ cums == true ? p:f}` + "C • Cumsluts",
                id: ".nsfw cums"
            },
            {
                title: `${ ecchi == true ? p:f}` + "E • Ecchi",
                id: ".nsfw ecchi"
            },
            {
                title: `${ ero == true ? p:f}` + "E • Ero",
                id: ".nsfw ero"
            },
            {
                title: `${ erofeet == true ? p:f}` + "E • Ero Feet",
                id: ".nsfw erofeet"
            },
            {
                title: `${ erogirl == true ? p:f}` + "E • Ero Girl",
                id: ".nsfw erogirl"
            },
            {
                title: `${ holoero == true ? p:f}` + "E • Ero Holo",
                id: ".nsfw holoero"
            },
            {
                title: `${ erokitsune == true ? p:f}` + "E • Ero Kitsune",
                id: ".nsfw erokitsune"
            },
            {
                title: `${ eroneko == true ? p:f}` + "E • Ero Neko",
                id: ".nsfw eroneko"
            },
            {
                title: `${ eroyuri== true ? p:f}` + "E • Ero Yuri",
                id: ".nsfw eroyuri"
            },
            {
                title: `${ feet == true ? p:f}` + "F • Feet",
                id: ".nsfw feet"
            },
            {
                title: `${ femdom == true ? p:f}` + "F • Femdom",
                id: ".nsfw femdom"
            },
            {
                title: `${ futanari == true ? p:f}` + "F • Futanari",
                id: ".nsfw futanari"
            },
            {
                title: `${ girlsolo == true ? p:f}` + "G • Girl Solo",
                id: ".nsfw girlsolo"
            },
            {
                title: `${ hentai == true ? p:f}` + "H • Hentai",
                id: ".nsfw hentai"
            },
            {
                title: `${ holo == true ? p:f}` + "H • Holo",
                id: ".nsfw holo"
            },
            {
                title: `${ jahy == true ? p:f}` + "J • Jahy",
                id: ".nsfw jahy"
            },
            {
                title: `${ kitsune == true ? p:f}` + "K • Kitsune",
                id: ".nsfw kitsune"
            },
            {
                title: `${ kuni == true ? p:f}` + "K • Kuni",
                id: ".nsfw kuni"
            },
            {
                title: `${ loli == true ? p:f}` + "L • Loli",
                id: ".nsfw loli"
            },
            {
                title: `${ manga== true ? p:f}` + "M • Manga",
                id: ".nsfw manga"
            },
            {
                title: `${ milf == true ? p:f}` + "M • Milf",
                id: ".nsfw milf"
            },
            {
                title: `${ mstrb == true ? p:f}` + "M • Mstrb",
                id: ".nsfw mstrb"
            },
            {
                title: `${ neko == true ? p:f}` + "N • Neko",
                id: ".nsfw neko"
            },
            {
                title: `${ oppai == true ? p:f}` + "O • Oppai",
                id: ".nsfw oppai"
            },
            {
                title: `${ panties == true ? p:f}` + "P • Panties",
                id: ".nsfw panties"
            },
            {
                title: `${ pussy == true ? p:f}` + "P • Pussy",
                id: ".nsfw pussy"
            },
            {
                title: `${ spank == true ? p:f}` + "S • Spank",
                id: ".nsfw spank"
            },
            {
                title: `${ tentacles == true ? p:f}` + "T • Tentacles",
                id: ".nsfw tentacles"
            },
            {
                title: `${ thighs == true ? p:f}` + "T • Thighs",
                id: ".nsfw thighs"
            },
            {
                title: `${ tits == true ? p:f}` + "T • Tits",
                id: ".nsfw tits"
            },
            {
                title: `${ trap == true ? p:f}` + "T • Trap",
                id: ".nsfw trap"
            },
            {
                title: `${ uniform == true ? p:f}` + "U • Uniform",
                id: ".nsfw uniform"
            },
            {
                title: `${ waifu == true ? p:f}` + "W • Waifu",
                id: ".nsfw waifu"
            },
            {
                title: `${ yaoi == true ? p:f}` + "Y • Yaoi",
                id: ".nsfw yaoi"
            },
            {
                title: `${ yuri == true ? p:f}` + "Y • Yuri",
                id: ".nsfw yuri"
            },
        ]
    }, ]

    const listMessage = {
        text: teks,
        footer: '┏- - - - -  INFO - - - - -\n┊ 🅟 = Premium\n┊ Ⓕ = Free\n┗•',
        title: `❏––––[ *NSFW* ]–––`,
        buttonText: "- -NSFW- -",
        sections
    }
    //--------------------------------


    //------------ CASE NSFW ! ------------

    try {
        if (/(nsfw)/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'ahegao':
                    if (ahegao == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'ahegao' + xapi)).arrayBuffer(), m)
                    break

                case 'anal':
                    if (anal == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'anal' + apil)).arrayBuffer(), m)
                    break

                case 'ass':
                    if (ass == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'ass' + xapi)).arrayBuffer(), m)
                    break

                case 'blowjob':
                    if (blowjob == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    let bj = await (await fetch(`https://api.waifu.pics/nsfw/blowjob`)).json()
                    conn.sendFile(m.chat, bj.url, m)
                    break

                case 'cums':
                    if (cums == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'cum' + apil)).arrayBuffer(), m)
                    break

                case 'ecchi':
                    if (ecchi == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'ecchi' + api)).arrayBuffer(), m)
                    break

                case 'ero':
                    if (ero == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'ero' + xapi)).arrayBuffer(), m)
                    break

                case 'erofeet':
                    if (erofeet == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'feet' + api)).arrayBuffer(), m)
                    break

                case 'erogirl':
                    if (erogirl == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'lewdanimegirls' + api)).arrayBuffer(), m)
                    break

                case 'holoero':
                    if (holoero == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'holo' + api)).arrayBuffer(), m)
                    break

                case 'erokitsune':
                    if (erokitsune == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'erok' + apil)).arrayBuffer(), m)
                    break

                case 'eroneko':
                    if (eroneko == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'eron' + apil)).arrayBuffer(), m)
                    break

                case 'eroyuri':
                    if (eroyuri == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'eroYuri' + api)).arrayBuffer(), m)
                    break

                case 'feet':
                    if (feet == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'feet' + api)).arrayBuffer(), m)
                    break

                case 'femdom':
                    if (femdom == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'femdom' + api)).arrayBuffer(), m)
                    break

                case 'futanari':
                    if (futanari == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'futanari' + api)).arrayBuffer(), m)
                    break

                case 'girlsolo':
                    if (girlsolo == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'solo' + apil)).arrayBuffer(), m)
                    break

                case 'hentai':
                    if (hentai == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'hentai' + xapi)).arrayBuffer(), m)
                    break

                case 'holo':
                    if (holo == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'hololewd' + api)).arrayBuffer(), m)
                    break

                case 'jahy':
                    if (jahy == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'jahy' + xapi)).arrayBuffer(), m)
                    break

                case 'kitsune':
                    if (kitsune == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'kitsune' + api)).arrayBuffer(), m)
                    break

                case 'kuni':
                    if (kuni == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(resl + 'kuni' + apil)).arrayBuffer(), m)
                    break

                case 'loli':
                    if (loli == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'loli' + api)).arrayBuffer(), m)
                    break

                case 'manga':
                    if (manga == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'manga' + xapi)).arrayBuffer(), m)
                    break

                case 'milf':
                    if (milf == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'milf' + api)).arrayBuffer(), m)
                    break

                case 'mstrb':
                    if (mstrb == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'mstrb' + xapi)).arrayBuffer(), m)
                    break

                case 'neko':
                    if (neko == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'nsfwneko' + xapi)).arrayBuffer(), m)
                    break

                case 'oppai':
                    if (oppai == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'sideoppai' + api)).arrayBuffer(), m)
                    break

                case 'panties':
                    if (panties == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'panties' + xapi)).arrayBuffer(), m)
                    break

                case 'pussy':
                    if (pussy == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'pussy' + xapi)).arrayBuffer(), m)
                    break

                case 'spank':
                    if (spank == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'spank' + api)).arrayBuffer(), m)
                    break

                case 'tentacles':
                    if (tentacles == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'tentacles' + xapi)).arrayBuffer(), m)
                    break

                case 'tits':
                    if (tits == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'tits' + api)).arrayBuffer(), m)
                    break

                case 'thighs':
                    if (thighs == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'thighs' + xapi)).arrayBuffer(), m)
                    break

                case 'trap':
                    if (trap == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    let tr = await (await fetch(`https://api.waifu.pics/nsfw/trap`)).json()
                    conn.sendFile(m.chat, tr.url, m)
                    break

                case 'uniform':
                    if (uniform == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(xres + 'uniform' + xapi)).arrayBuffer(), m)
                    break

                case 'waifu':
                    if (waifu == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    let wf = await (await fetch(`https://api.waifu.pics/nsfw/waifu`)).json()
                    conn.sendFile(m.chat, wf.url, m)
                    break

                case 'yaoi':
                    if (yuri == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'yaoi' + api)).arrayBuffer(), m)
                    break

                case 'yuri':
                    if (yuri == true) {
                        if (global.db.data.users[m.sender].premiumTime < 1) return conn.reply(m.chat, txtprem, m)
                    }
                    conn.sendFile(m.chat, await (await fetch(res + 'yuri' + api)).arrayBuffer(), m)
                    break

                default:
                    return await conn.sendButtonMessages(m.chat, [
            [listMessage.text, listMessage.footer, null, [
                ], null, null,
                [
                    [listMessage.buttonText, sections]
                ]
            ]
        ], m);
            }
        } else if (/hentong/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 : Math.min(1, count)
            switch (_type) {
                case 'A':
                    break
                case '':
                    break
                default:
                    return conn.reply(m.chat, caption, m)
            }
        }
    } catch (err) {
        m.reply("Error\n\n\n" + err.stack)
    }

    //-----------------------------

}

handler.help = ['nsfw <type>']
handler.tags = ['nsfw', 'premium']
handler.command = /^(nsfw)/i

export default handler