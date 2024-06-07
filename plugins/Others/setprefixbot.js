const handler = async (m, {
  text
}) => {
  if (!text || !/^\d$/.test(text)) return m.reply(`Mohon berikan angka (1 atau 2) sebagai prefix yang valid.`)
  const isNoPrefix = text === '1';
  const isMultiPrefix = text === '2';
  if (!isNoPrefix && !isMultiPrefix) return m.reply(
    `Prefix yang Anda masukkan tidak valid. Pilihan tersedia: 1 (no), 2 (multi)`)
  opts['noprefix'] = isNoPrefix ? true : false;
  opts['multiprefix'] = isMultiPrefix ? true : false;
  m.reply(`Prefix telah diubah ke *${isNoPrefix ? 'no' : 'multi'}*`)
}
handler.help = ['setprefix'].map(v => v + ' [prefix]')
handler.tags = ['owner']
handler.command = /^(setprefix)$/i
handler.rowner = true
export default handler
