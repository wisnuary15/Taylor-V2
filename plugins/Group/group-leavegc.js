const handler = async (m, {
  conn,
  usedPrefix,
  command,
  args,
  isOwner
}) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  let chat = Object.keys(conn.chats).filter((v) => v.endsWith('g.us'));
  let groups = Object.keys(conn.chats).filter((key) => key.endsWith('@g.us')).map((key) => conn.chats[key]);
  args[0] && (args[0]?.toLowerCase() === 'all' || args[0]?.toLowerCase() === 'semua') ? await Promise.all(chat.map(
    async (id) => {
      await conn.groupLeave(id);
      await delay(2000);
    })).then(() => m.reply('*Success!* Semua grup telah di-leave.')) : (() => {
    try {
      if (!args[0] || isNaN(args[0])) {
        let usageMessage =
          `⚠️ *Invalid input.* Harap berikan nomor grup yang valid.\n\nCara Penggunaan: ${usedPrefix + command} <nomor grup>`;
        let listMessage = "*List Grup:*\n" + groups.map((group, index) => `*${index + 1}.* ${group.subject}`)
          .join('\n');
        return m.reply(usageMessage + "\n\n" + listMessage);
      }
      let i = parseInt(args[0]);
      if (i <= 0 || i > groups.length) {
        let listMessage = "*⚠️ Invalid input.* Harap gunakan nomor grup yang valid.\n\n" + groups.map((group,
          index) => `*${index + 1}.* ${group.subject}`).join('\n');
        return m.reply(listMessage);
      }
      let groupIndex = i - 1;
      let str = `${[i]}
*Nama Grup :* ${groups[groupIndex].metadata.subject} 
*Owner :* ${groups[groupIndex].metadata.owner ? "@" + groups[groupIndex].metadata.owner.split("@")[0] : "Tidak Diketahui"}
*Subject Owner :* ${groups[groupIndex].metadata.subjectOwner ? "@" + groups[groupIndex].metadata.subjectOwner.split("@")[0] : "Tidak Diketahui"}
*ID :* ${groups[groupIndex].metadata.id}
*Restrict :* ${groups[groupIndex].metadata.restrict}
*Announce :* ${groups[groupIndex].metadata.announce}
*Ephemeral :* ${new Date(groups[groupIndex].metadata.ephemeralDuration * 1000).toDateString()}
*Desc ID :* ${groups[groupIndex].metadata.descId}
*Description :* ${groups[groupIndex].metadata.desc?.toString().slice(0, 10) + '...' || 'Tidak Diketahui'}
*Admins :* ${groups[groupIndex].metadata.participants.filter(p => p.admin).map((v, i) => `\n${i + 1}. @${v.id.split('@')[0]}`).join(' [admin]')}
${isOwner ? `*Participants :* ${groups[groupIndex].metadata.participants.length}` : ''}
${isOwner ? `*isBotAdmin :* [ ${!!groups[groupIndex].metadata.participants.find(v => v.id === conn.user.jid).admin} ]` : ''}
*Created :* ${new Date(groups[groupIndex].metadata.subjectTime * 1000).toDateString()}
*Creation :* ${new Date(groups[groupIndex].metadata.creation * 1000).toDateString()}
*Size :* ${groups[groupIndex].metadata.size}
`;
      return m.reply(str).then(() => conn.groupLeave(groups[groupIndex].metadata.id)).then(() => delay(2000))
        .then(() => m.reply('*Success!* Grup ' + groups[groupIndex].metadata.subject + ' telah di-leave!'));
    } catch (err) {
      return m.reply('*Error!* Terjadi kesalahan.').then(() => console.error(err));
    }
  })();
};
handler.help = ['leave', 'leavegc'].map((v) => v + ' <nomor grup>');
handler.tags = ['group'];
handler.command = /^leave(g(c|ro?up))?$/i;
handler.rowner = true;
handler.owner = true;
handler.premium = true;
export default handler;
