import fetch from 'node-fetch'
let handler = async (m, {
    usedPrefix,
    command
}) => {
    try {
        let res = await fetch('https://raw.githubusercontent.com/hamidamaulana/bacaan-sholat-main/main/assets/data/niatshalat.json')
        let json = await res.json()
        let niat = json.map((v, i) => `${i + 1}. ${v.name}\n↳ ${v.arabic}\n↳ ${v.latin}\n↳ ${v.terjemahan}`).join('\n\n')
        m.reply(niat)
    } catch (e) {
        throw `_*Error!*_`
    }
}
handler.help = ['niatshalat']
handler.tags = ['islam']
handler.command = /^(niatsh?(a|o)lat)$/i
export default handler