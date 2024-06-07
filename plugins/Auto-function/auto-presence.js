export async function before(m) {
  const chat = db.data.chats[m.chat];
  if (!m.text || !chat.autoPresence) return false;
  const commands = Object.values(plugins).flatMap((plugin) => []?.concat(plugin.command));
  const presenceStatus = commands.some((cmd) => (cmd instanceof RegExp ? cmd.test(m.text) : m.text.includes(cmd))) ?
    'composing' : 'available';
  if (presenceStatus) await this.sendPresenceUpdate(presenceStatus, m.chat);
}
export const disabled = false;
