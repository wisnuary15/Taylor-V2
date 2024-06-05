import {
    spawn
} from 'child_process';
const handler = async (m, {
    conn
}) => {
    if (!process.send) throw 'Dont: node main.js\nDo: node index.js'
    if (conn.user.jid === conn.user.jid) {
        m.reply('Sedang merestart bot...')
        await db.write()
        process.send('reset')
    } else throw 'Error. Tempat run tidak mendukung fitur debounce.'
}
handler.help = ['debounce' + (process.send ? '' : ' (Tidak Bekerja)')]
handler.tags = ['host']
handler.command = /^debounce$/i
handler.owner = true
export default handler
