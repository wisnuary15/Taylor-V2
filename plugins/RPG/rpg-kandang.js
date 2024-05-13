const handler = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];
    const animals = {
        banteng: user.banteng,
        harimau: user.harimau,
        gajah: user.gajah,
        kambing: user.kambing,
        panda: user.panda,
        buaya: user.buaya,
        kerbau: user.kerbau,
        sapi: user.sapi,
        monyet: user.monyet,
        babihutan: user.babihutan,
        babi: user.babi,
        ayam: user.ayam
    };

    let ndy = `
*${htki} KANDANG ${htka}*
    
 *➡️   ️ 🐂 = [ ${animals.banteng} ] Ekor Banteng*
 *➡️   ️ 🐅 = [ ${animals.harimau} ] Ekor Harimau*
 *➡️   ️ 🐘 = [ ${animals.gajah} ] Ekor Gajah*
 *➡️   ️ 🐐 = [ ${animals.kambing} ] Ekor Kambing*
 *➡️   ️ 🐼 = [ ${animals.panda} ] Ekor Panda*
 *➡️   ️ 🐊 = [ ${animals.buaya} ] Ekor Buaya*
 *➡️   ️ 🐃 = [ ${animals.kerbau} ] Ekor Kerbau*
 *➡️   ️ 🐮 = [ ${animals.sapi} ] Ekor Sapi*
 *➡️   ️ 🐒 = [ ${animals.monyet} ] Ekor Monyet*
 *➡️   ️ 🐗 = [ ${animals.babihutan} ] Ekor Babi Hutan*
 *➡️   ️ 🐖 = [ ${animals.babi} ] Ekor Babi*
 *➡️   ️ 🐓 = [ ${animals.ayam} ] Ekor Ayam*
 `.trim();
    await conn.reply(m.chat, ndy, m);
};

handler.help = ['kandang'];
handler.tags = ['rpg'];
handler.command = /^(kandang)$/i;

export default handler;
