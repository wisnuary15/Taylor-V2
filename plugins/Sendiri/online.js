let handler = async (m, { conn, args }) => {
    try {
        let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat;
        let chat = conn.chats.get(id);
        
        if (!chat) throw new Error('Chat not found');
        
        let onlineUsers = [...Object.keys(chat.presences), conn.user.jid];
        let onlineMention = onlineUsers.map(v => `@${v.replace(/@.+/,'')}`).join('\n');
        
        let message = `┌─〔 Daftar Online 〕\n${onlineMention}\n└────`;
        
        conn.reply(m.chat, message, m, {
            contextInfo: { mentionedJid: onlineUsers }
        });
    } catch (error) {
        console.error(error);
        m.reply('❌ Terjadi kesalahan saat memproses permintaan.');
    }
};

handler.help = ['here', 'online'];
handler.tags = ['group'];
handler.command = /^(here|(list)?online)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = false;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;
