import {
    sticker
} from '../../lib/sticker.js'
import wibusoft from 'wibusoft'
const handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)
    const text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;
    if (!text) return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
    var fakec
    let avatar = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph//file/c4044a0d3b4cc8b8dc2dd.jpg')
    try {
        fakec = "https://mfarels.my.id/api/fakechat-wa?nama=" + encodeURIComponent(name) + "&text=" + encodeURIComponent(text) + "&no=" + encodeURIComponent(who.split("@")[0])
    } catch (e) {
        try {
            fakec = `https://xzn.wtf/api/fakechat?text=${encodeURIComponent(text)}&username=${name}&avatar=${avatar}&apikey=wudysoft`
        } catch (e) {
            m.reply(eror)
        }
    }
    var out = await wibusoft.tools.makeSticker(fakec, {
        author: packname,
        pack: name,
        keepScale: true
    })
    m.reply(wait)
    try {
        m.reply(out)
    } catch (e) {
        throw eror
    }
}
handler.help = ['fakechat (text)']
handler.tags = ['sticker']
handler.command = /^(fakechat)$/i
export default handler
