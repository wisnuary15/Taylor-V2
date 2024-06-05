import cp, {
    exec as _exec
} from 'child_process'
import {
    promisify
} from 'util'
let exec = promisify(_exec).bind(cp)
const handler = async (m, {
    conn,
    isOwner,
    command,
    text
}) => {
    if (conn.user.jid != conn.user.jid) return
    m.reply('Executing...')
    let o
    try {
        o = await exec(command.trimStart() + ' ' + text.trimEnd())
    } catch (e) {
        o = e
    } finally {
        let {
            stdout,
            stderr
        } = o
        if (stdout.trim()) m.reply(stdout)
        if (stderr.trim()) m.reply(stderr)
    }
}
handler.customPrefix = /^[$] /
handler.command = new RegExp
handler.rowner = true
export default handler
