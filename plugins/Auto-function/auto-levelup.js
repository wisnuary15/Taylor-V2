import {
    canLevelUp,
    xpRange
} from "../../lib/levelling.js"
import {
    levelup
} from "../../lib/canvas.js"
export async function before(m) {
    if (m.isBaileys || !m.sender) return false;
    let user = db.data.users[m.sender]
    let chats = db.data.chats[m.chat]
    if (!chats.autolevelup) return false;
    let beforeLevel = user.level * 1
    while (canLevelUp(user.level, user.exp, multiplier)) user.level++
    if (beforeLevel !== user.level) {
        let teks = `Selamat ${await this.getName(m.sender)} naik 🧬level\n.             ${user.role}`
        let str = `Selamat ${await this.getName(m.sender)} naik 🧬level\n.             ${user.role}

*🎉 C O N G R A T S 🎉*
*${beforeLevel}* ➔ *${user.level}* [ *${user.role}* ]

• 🧬Level Sebelumnya : ${beforeLevel}
• 🧬Level Baru : ${user.level}
• Pada Jam : ${new Date().toLocaleString("id-ID")}

*Note:* _Semakin sering berinteraksi dengan bot Semakin Tinggi level kamu_
`.trim()
        let {
            min,
            xp,
            max
        } = xpRange(user.level, multiplier)
        let pp = await this.profilePictureUrl(m.sender).catch(_ => "./src/avatar_contact.png")
        let exp = user.exp
        let required = xp
        let role = user.role
        let level = user.level
        let disec = m.sender.substring(3, 7)
        let sortedlevel = Object.entries(db.data.users).sort((a, b) => b[1].level - a[1].level)
        let userslevel = sortedlevel?.map(v => v[0])
        let rank = (userslevel.indexOf(m.sender) + 1)
        let ppuser
        try {
            ppuser = await this.profilePictureUrl(m.sender, "image")
        } catch {
            ppuser = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMxMUXFtd5GrFkxyrU-f5zA2IH8MZ-U-cFKg&usqp=CAU"
        }
        try {
            let datac = await levelup(teks, user.level)
            this.sendFile(m.chat, datac, "", str, m)
        } catch (e) {
            try {
                this.sendFile(m.chat, flaaa.getRandom() + "levelup", "", str, m)
            } catch (e) {
                m.reply(str || eror)
            }
        }
    }
}
