export async function before(m) {
    const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender;
    const name = who.split("@")[0]
    const chat = db.data.chats[m.chat];
    const {
        banned
    } = db.data.users[m.sender];
    if (!m.sender || !chat) return false
    if (chat.autoReply && !m.isBaileys) {
        if (m.mtype === 'groupInviteMessage' || m.text.startsWith('https://chat') || m.text.startsWith('Buka tautan ini')) {
            this.reply(m.chat, `✨ *Undang Bot ke Grup* ✨\n💎 7 Hari / Rp 5,000\n💎 30 Hari / Rp 15,000`, m, {
                mentions: [m.sender]
            });
            this.reply(m.sender + '@s.whatsapp.net', `Ada yang mau nyulik nih :v \n\nDari: @${m.sender.split("@")[0]} \n\nPesan: ${m.text}`, m, {
                mentions: [m.sender]
            });
        }
        let reactCaption = '';
        if (m.mtype === 'reactionMessage') {
            const action = m.text ? 'Mengirim' : 'Menghapus';
            const message = m.text ? `Reaction: ${m.text}` : 'Reaction';
            reactCaption = `🎭 *Terdeteksi* @${name} ${action} ${message}`;
        }
        if (m.mtype === 'editedMessage') {
            try {
                console.log(m.mtype);
                const tittle_edit = `*Edited Message* @${m.sender.split('@')[0]}`
                const message_edit = m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text
                const quoted_edit = this.loadMessage(m.message.editedMessage.message.protocolMessage.key.id)
                return await this.sendMessage(m.chat, {
                    text: `${tittle_edit}\n\n${message_edit}`,
                    mentions: [m.sender]
                }, {
                    quoted: quoted_edit
                });
            } catch (e) {
                console.log(e);
            }
        }
        const messages = {
            reactionMessage: reactCaption,
            paymentMessage: `💸 *Terdeteksi* @${name} Lagi Meminta Uang`,
            productMessage: `📦 *Terdeteksi* @${name} Lagi Promosi`,
            orderMessage: `🛒 *Terdeteksi* @${name} Lagi Meng Order`,
            pollCreationMessage: `📊 *Terdeteksi* @${name} Lagi Polling`,
            contactMessage: `📞 *Terdeteksi* @${name} Lagi Promosi Kontak`,
        };
        if (m.mtype in messages) {
            const caption = messages[m.mtype];
            const mentions = this.parseMention(caption);
            this.reply(m.chat, caption, m, {
                mentions
            });
        }
        const triggerWords = ['aktif', 'wey', 'we', 'hai', 'oi', 'oy', 'p', 'bot'];
        const lowerText = m.text.toLowerCase();
        if (triggerWords.some(word => lowerText === word)) {
            const apsih = ["Kenapa", "Ada apa", "Naon meng", "Iya, bot disini", "Luwak white coffee passwordnya", "Hmmm, kenapa", "Apasih", "Okey bot sudah aktif", "2, 3 tutup botol", "Bot aktif"];
            const caption = `🤖 *${apsih[Math.floor(Math.random() * apsih.length)]}* kak @${name} 🗿`;
            this.reply(m.chat, caption, m, {
                mentions: [who]
            });
        }
        if (m.mtype === 'stickerMessage' || m.text.includes('🗿')) {
            await this.sendMessage(m.chat, {
                react: {
                    text: '🗿',
                    key: m.key
                }
            });
        }
    }
    return true;
}
