import {
    translate
} from '@vitalets/google-translate-api'
import fetch from "node-fetch"

let handler = async (m, {
    args,
    usedPrefix,
    command
}) => {
    let lang, text
    if (args.length >= 2) {
        lang = args[0] ? args[0] : "id", text = args.slice(1).join(" ")
    } else if (m.quoted && m.quoted.text) {
        lang = args[0] ? args[0] : "id", text = m.quoted.text
    } else throw `Ex: ${usedPrefix + command} id hello i am robot`
    try {
        const prompt = (text.trim());
        let res = await translate(prompt, {
            to: lang,
            autoCorrect: true
        }).catch(_ => null)
        let lister = Object.keys(await langList())
        if (!res) throw "Error : Bahasa *" + lang + "* Tidak Support\n\n*Pilih kode yg ada*\n" + lister.map((v) => v).join(", ")

        let Detect = (res.raw.src.toUpperCase() ? res.raw.src.toUpperCase() : "US")
        let ToLang = (lang.toUpperCase())
        let caption = `*[ Terdeteksi ]*
- ${Detect}

*[ Ke Bahasa ]*
- ${ToLang}

*[ Terjemahan ]*
- ${res.text}
`
        await m.reply(caption, null, m.mentionedJid ? {
            mentions: await conn.parseMention(caption)
        } : {})
    } catch (e) {
        await m.reply(eror)
    }
}
handler.help = ["translate2"].map(v => v + " <lang> <teks>")
handler.tags = ["tools"]
handler.command = /^(t(erjemahkan|ransl(ate|et))2|t(erjemah|r)2|apanih2)$/i

export default handler

async function langList() {
    let data = await fetch("https://translate.google.com/translate_a/l?client=webapp&sl=auto&tl=en&v=1.0&hl=en&pv=1&tk=&source=bh&ssel=0&tsel=0&kc=1&tk=626515.626515&q=")
        .then((response) => response.json())
    return data.tl;
}