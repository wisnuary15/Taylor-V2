const handler = async (m, {
    conn,
    usedPrefix,
    participants
}) => {
    conn.level = db.data.users[m.sender]
    conn.fightnaga = conn.fightnaga ? conn.fightnaga : {}
    const delay = time => new Promise(res => setTimeout(res, time));
    if (typeof conn.fightnaga[m.sender] != "undefined" && conn.fightnaga[m.sender] === true) return m.reply(`*Tidak bisa melakukan battle karena arena yg kamu miliki sedang kamu pakai .*`)
    let users = participants?.map(u => u.id)
    var lawan
    lawan = users[Math.floor(users.length * Math.random())]
    while (typeof db.data.users[lawan] === "undefined" || lawan === m.sender) {
        lawan = users[Math.floor(users.length * Math.random())]
    }
    let lamaPertarungan = Acakin(8, 20)
    m.reply(`*Pet Kamu* (🐱kucing ${db.data.users[m.sender].kucing}) menantang 🐈kucingnya *${await conn.getName(lawan)}* (🐱kucing ${db.data.users[lawan].kucing}) lagi kelahi rebutin bini.\n\nTunggu ${lamaPertarungan} menit lagi dan lihat siapa yg menang🎮.`)
    conn.fightnaga[m.sender] = true
    await delay(1000 * 60 * lamaPertarungan)
    let alasanKalah = ['Naikin lagi levelnya😐', 'Cupu', 'Kurang hebat', 'Ampas Petnya', 'Pet gembel']
    let alasanMenang = ['Hebat', 'Pro', 'Ganas Pet', 'Legenda Pet', 'Sangat Pro', 'Rajin Ngasi Makan Pet']
    let kesempatan = []
    for (i = 0; i < db.data.users[m.sender].kucing; i++) kesempatan.push(m.sender)
    for (i = 0; i < db.data.users[lawan].kucing; i++) kesempatan.push(lawan)
    let pointPemain = 0
    let pointLawan = 0
    for (i = 0; i < 10; i++) {
        unggul = Acakin(0, kesempatan.length - 1)
        if (kesempatan[unggul] === m.sender) pointPemain += 1
        else pointLawan += 1
    }
    if (pointPemain > pointLawan) {
        let hadiah = (pointPemain - pointLawan) * 20000
        db.data.users[m.sender].money += hadiah
        db.data.users[m.sender].tiketcoin += 1
        m.reply(`*${await conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${await conn.getName(lawan)}*\n\n*Pet🐈Kamu* (kucing ${db.data.users[m.sender].kucing}) MENANG melawan 🐈kucingnya *${await conn.getName(lawan)}* (kucing ${db.data.users[lawan].kucing}) karena kucing🐈kamu ${alasanMenang[Acakin(0,alasanMenang.length-1)]}\n\nHadiah Rp. ${hadiah.toLocaleString()}\n+1 Tiketcoin`)
    } else if (pointPemain < pointLawan) {
        let denda = (pointLawan - pointPemain) * 100000
        db.data.users[m.sender].money -= denda
        db.data.users[m.sender].tiketcoin += 1
        m.reply(`*${await conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${await conn.getName(lawan)}*\n\n*Pet🐈Kamu* (kucing ${db.data.users[m.sender].kucing}) KALAH melawan 🐈kucingnya *${await conn.getName(lawan)}* (kucing ${db.data.users[lawan].kucing}) karena pet kamu ${alasanKalah[Acakin(0,alasanKalah.length-1)]}\n\nUang kamu berkurang Rp. ${denda.toLocaleString()}\n+1 Tiketcoin`)
    } else {
        m.reply(`*${await conn.getName(m.sender)}* [${pointPemain * 10}] - [${pointLawan * 10}] *${await conn.getName(lawan)}*\n\nHasil imbang kak, ga dapet apa apa 😂`)
    }
    delete conn.fightnaga[m.sender]
}
handler.help = ['fightkucing']
handler.tags = ['game']
handler.command = /^(fightkucing)$/i
handler.limit = true
handler.group = true
export default handler

function Acakin(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}
