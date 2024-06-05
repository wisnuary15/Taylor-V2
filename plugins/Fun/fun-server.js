import cp from 'child_process'
import {
    promisify
} from 'util'
let exec = promisify(cp.exec).bind(cp)
const handler = async (m) => {
    m.reply(wait)
    let o
    try {
        o = await exec('df -h')
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
handler.help = ['statserver']
handler.tags = ['info']
handler.command = /^(statserver)$/i
export default handler
