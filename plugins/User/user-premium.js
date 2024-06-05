export async function all(m) {
    let {
        sender,
        isBaileys
    } = m;
    if (!sender || isBaileys) return false;
    let user = db.data.users[sender];
    if (m.chat?.endsWith('broadcast')) return false;
    if (user.premiumTime && user.premium && Date.now() >= user.premiumTime) {
        m.reply(`Waktu premium Anda sudah habis!`);
        user.premiumTime = 0;
        user.premium = false;
    }
}
