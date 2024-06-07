const handler = async (m, {
  conn,
  groupMetadata,
  args,
  usedPrefix,
  command
}) => {
  let ids = groupMetadata.participants.filter(p => !p.admin || p.superadmin).map(v => v.id);
  let text;
  let listSections = [];
  const getNamePromises = ids.map(async (id, index) => {
    let name = conn.getName(id);
    listSections.push(["Result [ " + (index + 1) + ' ]', [
      ['❌ KICK ' + (name === undefined ? 'Unknown' : name), usedPrefix + command + ' ' + id, '']
    ]]);
  });
  await Promise.all(getNamePromises);
  if (args.length >= 1) {
    text = args.join(" ");
  } else if (m.quoted && m.quoted?.sender) {
    text = m.quoted?.sender;
  } else {
    return conn.sendList(m.chat, htki + " 📺 Models 🔎 " + htka, '⚡ Silakan pilih User', author, "☂️ M O D E L ☂️",
      listSections, m);
  }
  if (!ids.includes(text)) throw 'Dia Sudah Out';
  return conn.groupParticipantsUpdate(m.chat, [text], 'remove');
}
handler.help = ['kick', '-'].map(v => 'g' + v + ' @user');
handler.tags = ['owner'];
handler.command = /^g?kick$/i;
handler.owner = true;
handler.group = true;
handler.botAdmin = true;
export default handler;
